import cv2
import base64
from dotenv import load_dotenv
import os
import json
import io
from src.function.video_analysis import utils
import time
from aiohttp import ClientSession, ClientError
from openai import OpenAI

logger = utils.setup_logger(__name__, f"./openai_request_logger_{int(time.time())}.log")

load_dotenv()

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("GROQ_API_KEY")
)
VISON_MODEL = "llama-3.2-11b-vision-preview"

print(os.curdir)

with open("./src/function/video_analysis/openai_analysis_json_template.txt") as f:
	analysis_template = f.read()

async def analyze_images(
		session: ClientSession,
		images: list,
		metadata: dict[str, str] = {}
	) -> dict:
	"""
		Receives a list of images supposedly to be sampled from a video, gives them
		to OpenAI API, and returns the analysis on them.

		Metadata is optional, and is provided as-is to the prompt to OpenAI
	"""
	# Convert the images to JPG format
	base_64_list = []
	for image in images:
		_, image_jpg = cv2.imencode('.jpg', image)
		base_64_list.append(base64.b64encode(image_jpg.tobytes()).decode('utf-8'))

	headers = {
		"Content-Type": "application/json",
		"Authorization": f"Bearer { os.environ.get('GROQ_API_KEY') }"
	}

	content = []
	content.append(
		{
			"type": "text",
			"text": """These images are from a TikTok video. """
			"""Analyze this video using simple and to-the-point vocab using this json format: """
			f"""{ analysis_template }"""
			f"""Included is a metadata of the video for better analysis: {json.dumps(metadata)} """
		})
	
	for base64_image in base_64_list:
		content.append(
			{
				"type": "image_url",
				"image_url": {
					"detail": "low", # details low is around 20 tokens, while detail high is around 900 tokens
					"url": f"data:image/jpeg;base64,{base64_image}"
				}
			})

	# payload = {
	# 	"model": "llama-3.2-11b-vision-preview",
  	# "response_format": {"type": "json_object"},
	# 	"messages": [
	# 		{
	# 			"role": "user",
	# 			"content": content
	# 		}
	# 	],
	# 	"max_tokens": 200
	# }
	# return await _send_request(session, payload, headers)

	print("Completing message")

	output = client.chat.completions.create(
		messages=[
			{
				"role": "user",
				"content": content
			}
		],
		model=VISON_MODEL,
	)

	analysis_raw = output.choices[0].message.content
	print(analysis_raw)
	analysis_json = json.loads(analysis_raw)
	return analysis_json

async def analyze_transcript(
		session: ClientSession,
		transcript: str,
		metadata: dict[str, str] = {}
	) -> dict:
	"""
		Receives a list of images supposedly to be sampled from a video, gives them
		to OpenAI API, and returns the analysis on them.

		Metadata is optional, and is provided as-is to the prompt to OpenAI
	"""

	headers = {
		"Content-Type": "application/json",
		"Authorization": f"Bearer { os.environ.get('GROQ_API_KEY') }"
	}

	content = []
	content.append(
		{
			"type": "text",
			"text": """This is a transcript from a TikTok video. """
			"""Analyze this video in details using simple and to-the-point vocab using this json format: """
			f"""{ analysis_template }"""
			f"""Included is a metadata of the video for more things to analyze: {json.dumps(metadata)} """
			f"""Transcript: { transcript }"""
		})

	payload = {
		"model": "gpt-4o-mini",
  	"response_format": {"type": "json_object"},
		"messages": [
			{
				"role": "user",
				"content": content
			}
		],
		"max_tokens": 400
	}

	return await _send_request(session, payload, headers)

async def _send_request(
		session: ClientSession,
		payload: dict,
		headers: dict
	) -> str:

	logger.info(f"Sending request to OpenAI with payload { payload }")

	try:
		payload_bytes = io.BytesIO(json.dumps(payload).encode('utf-8'))
		async with session.post(
			url="https://api.openai.com/v1/chat/completions",
			data=payload_bytes,
			headers=headers
		) as response:
			response_json = await response.json()

			logger.info(f"Reponse received from OpenAI with code {response.status}: {json.dumps(response_json)}")

			analysis_raw = response_json["choices"][0]["message"]["content"]

			analysis_json = json.loads(analysis_raw)
			return analysis_json

	except ClientError as e:
		logger.error(f"ClientError during requesting OpenAI: {e}")
		return {"error": "An error has happened"}
	
	except Exception as e:
		logger.error(f"Some happened during requesting OpenAI: {e}")
		return {"error": "An error has happened"}
