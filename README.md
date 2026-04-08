<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/508343eb-6d37-4b7e-a8dc-d62d5f22d6a3

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Mandatory Evaluation Requirements (Inference)

This project supports a dedicated compliance layer via `inference.py` located at the root. This is the evaluator-facing script that acts independently of the main full-stack website structure.

### Configuration
To run the inference script, you must define the following variables in your environment (or `.env` file):
*   `API_BASE_URL` - API endpoint for the LLM
*   `MODEL_NAME` - The model identifier for inference
*   `HF_TOKEN` - Your Hugging Face or API Key

### Running the Evaluator
```bash
# Install dependencies (requires openai SDK)
pip install -r requirements.txt

# Run the standalone inference script
python inference.py
```

**Note**: Exact `[START]`, `[STEP]`, and `[END]` formatting can be finalized once the official sample script is provided. The `inference.py` file includes a clearly isolated `SAMPLE LOG FORMAT ADAPTER` block specifically to make replacing field names and order fast and painless.
