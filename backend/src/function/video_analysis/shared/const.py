
import os

from dotenv import load_dotenv
load_dotenv()


with open("./src/function/video_analysis/prompts/openai_analysis_json_template.txt") as f:
	openai_analysis_template = f.read()
 
with open("./src/function/video_analysis/prompts/groq_analysis_json_template.txt") as f:
	groq_analysis_template = f.read()

version_configs = {
	"openai": {
		"base_url": "https://api.openai.com/v1/chat/completions",
		"text_model": "gpt-4o",
		"vision_model": "gpt-4o",
		"api_key": os.environ.get("OPENAI_API_KEY"),
        "prompt": openai_analysis_template
	},
	"groq": {
		"base_url": "https://api.groq.com/openai/v1",
		"text_model": "llama-3.3-70b-versatile",
		"text_model": "llama-3.2-11b-vision-preview",
		"api_key": os.environ.get("GROQ_API_KEY"),
        "prompt": groq_analysis_template
	}
}