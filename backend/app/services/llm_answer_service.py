import json
import httpx
from app.core.config import settings


class LLMAnswerService:
    def __init__(self):
        self.groq_api_key = settings.GROQ_API_KEY
        self.groq_model = settings.GROQ_MODEL
        self.groq_base_url = settings.GROQ_BASE_URL.rstrip("/")

    def _generate_with_groq(self, system_prompt: str, user_prompt: str) -> str | None:
        if not self.groq_api_key:
            return None

        try:
            response = httpx.post(
                f"{self.groq_base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.groq_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.groq_model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "temperature": 0.2,
                },
                timeout=60.0,
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except Exception:
            return None

    def _fallback_answer(self, query: str, context: str) -> str:
        if not context.strip():
            return "I couldn't find relevant information in the uploaded document for that question."

        snippets = [segment.strip() for segment in context.split("\n\n") if segment.strip()]
        preview = "\n\n".join(snippets[:2])
        return (
            "The model API is unavailable, so I answered directly from the uploaded PDF excerpts below.\n\n"
            f"Question: {query}\n\n"
            f"Relevant context:\n{preview}"
        )

    def generate_answer(self, query: str, context: str, use_web: bool = False) -> str:
        system_prompt = (
            "You are an expert AI research assistant. Answer based only on the supplied context. "
            "If the answer is missing from the context, say you do not have enough information."
        )
        user_prompt = f"Context:\n{context}\n\nQuestion: {query}\n\nAnswer clearly and concisely."
        content = self._generate_with_groq(system_prompt, user_prompt)
        return content if content else self._fallback_answer(query, context)

    def generate_source_map(self, topic: str, context: str) -> dict:
        system_prompt = (
            "Create compact concept maps as valid JSON. Return only JSON with keys "
            '"nodes" and "links". Each node should include id, label, group, summary, and references.'
        )
        user_prompt = f"""
Topic: {topic}

Context:
{context}

Return JSON in this format:
{{
  "nodes": [
    {{"id": "topic", "label": "{topic}", "group": "topic", "summary": "Main idea", "references": ["text"]}},
    {{"id": "node-1", "label": "Subtopic", "group": "subtopic", "summary": "Detail", "references": ["text"]}}
  ],
  "links": [
    {{"source": "topic", "target": "node-1"}}
  ]
}}
"""
        content = self._generate_with_groq(system_prompt, user_prompt)
        if content:
            try:
                cleaned = content.replace("```json", "").replace("```", "").strip()
                return json.loads(cleaned)
            except Exception:
                pass
        return self._fallback_source_map(topic, context)

    def _fallback_source_map(self, topic: str, context: str) -> dict:
        snippets = [segment.strip() for segment in context.split("\n\n") if segment.strip()]
        keywords: list[str] = []

        for snippet in snippets:
            for raw_word in snippet.replace(",", " ").replace(".", " ").split():
                word = raw_word.strip("()[]{}:;!?\"'").lower()
                if len(word) < 5:
                    continue
                if word in {"which", "their", "there", "about", "these", "those", "would", "could", "should"}:
                    continue
                if word not in keywords:
                    keywords.append(word)
                if len(keywords) >= 6:
                    break
            if len(keywords) >= 6:
                break

        nodes = [
            {
                "id": "topic",
                "label": topic,
                "group": "topic",
                "summary": f"Primary concept map for {topic}.",
                "references": snippets[:2],
            }
        ]
        links = []

        for index, keyword in enumerate(keywords, start=1):
            node_id = f"node-{index}"
            related_snippets = [snippet[:220] for snippet in snippets if keyword in snippet.lower()][:2]
            nodes.append(
                {
                    "id": node_id,
                    "label": keyword.replace("-", " ").title(),
                    "group": "subtopic",
                    "summary": related_snippets[0] if related_snippets else f"Related idea connected to {topic}.",
                    "references": related_snippets,
                }
            )
            links.append({"source": "topic", "target": node_id})

        if len(nodes) == 1:
            nodes.append(
                {
                    "id": "node-1",
                    "label": "Document Findings",
                    "group": "subtopic",
                    "summary": snippets[0][:220] if snippets else f"No extracted passages were found for {topic}.",
                    "references": snippets[:2],
                }
            )
            links.append({"source": "topic", "target": "node-1"})

        return {"nodes": nodes, "links": links}
