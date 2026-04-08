import os
import sys
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env / .env.local
load_dotenv()

# ==========================================
# SAMPLE LOG FORMAT ADAPTER
# ==========================================
# Edit this block to match the official sample's formatting
# requirements character-for-character once provided.

def log_start(message: str):
    print(f"[START] {message}", flush=True)

def log_step(step_name: str, details: str):
    print(f"[STEP] {step_name}: {details}", flush=True)

def log_end(message: str):
    print(f"[END] {message}", flush=True)

# ==========================================

def main():
    # Load configuration
    api_base_url = os.getenv("API_BASE_URL")
    model_name = os.getenv("MODEL_NAME")
    hf_token = os.getenv("HF_TOKEN")

    # Validate required environment variables
    missing_vars = [var for var, val in {
        "API_BASE_URL": api_base_url,
        "MODEL_NAME": model_name,
        "HF_TOKEN": hf_token
    }.items() if not val]

    if missing_vars:
        print(f"Error: Missing required environment variables: {', '.join(missing_vars)}")
        print("Ensure API_BASE_URL, MODEL_NAME, and HF_TOKEN are set before running.")
        sys.exit(1)

    log_start(f"Initializing ::-1 Inference Engine for model: {model_name}")

    try:
        log_step("ClientInit", "Initializing OpenAI client with API_BASE_URL and HF_TOKEN")
        client = OpenAI(
            api_key=hf_token,
            base_url=api_base_url,
        )

        # Sample Evaluation Run
        prompt = "Explain the importance of document context in retrieval-augmented generation."
        log_step("InferenceCall", f"Requesting completion for prompt: '{prompt}'")
        
        # Execute call
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": "You are a helpful AI research assistant."},
                {"role": "user", "content": prompt}
            ]
        )

        log_step("InferenceComplete", "Received successful response from LLM endpoint")
        print(f"\n--- Output ---\n{response.choices[0].message.content}\n--------------\n")
        
        log_end("Inference layer execution completed successfully.")
    except Exception as e:
        log_step("Error", f"Inference failed with exception: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()