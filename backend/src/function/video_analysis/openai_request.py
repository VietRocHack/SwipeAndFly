import cv2
import base64
import os
import json
import io
import time

from src.function.video_analysis.shared import utils
from aiohttp import ClientSession, ClientError
from src.function.video_analysis.shared.const import version_configs

logger = utils.setup_logger(__name__, f"./openai_request_logger_{int(time.time())}.log")

async def analyze_images(
		session: ClientSession,
		images: list,
		metadata: dict[str, str] = {},
		version: str = "openai"
	) -> dict:
	"""
		Receives a list of images supposedly to be sampled from a video, gives them
		to OpenAI API, and returns the analysis on them.

		Metadata is optional, and is provided as-is to the prompt to OpenAI
	"""
	
	# Get version config based on recommendation model version
	config = version_configs[version]
 
	# Convert the images to JPG format
	base_64_list = []
	for image in images:
		_, image_jpg = cv2.imencode('.jpg', image)
		base_64_list.append(base64.b64encode(image_jpg.tobytes()).decode('utf-8'))

	# Prepare content for messages
	content = []
	content.append(
		{
			"type": "text",
			"text": """These images are from a TikTok video. """
			"""Analyze this video using simple and to-the-point vocab using this json format: """
			f"""{ config.analysis_template }"""
			f"""Included is a metadata of the video for better analysis: {json.dumps(metadata)} """
		})

	# Prepare images in user message
	for base64_image in base_64_list:
		content.append(
			{
				"type": "image_url",
				"image_url": {
					"detail": "low", # details low is around 20 tokens, while detail high is around 900 tokens
					"url": f"data:image/jpeg;base64,{base64_image}"
				}
			})

	# Define headers
	headers = {
		"Content-Type": "application/json",
		"Authorization": f"Bearer { config.api_key }"
	}

	# Define payload
	payload = {
		"model": config.model,
		"response_format": {
      		"type": "json_object"
        },
		"messages": [
			{
				"role": "user",
				"content": content
			}
		],
		"max_tokens": 200
	}
	return await _send_request(session, payload, headers)

async def analyze_transcript(
		session: ClientSession,
		transcript: str,
		metadata: dict[str, str] = {},
		version: str = "openai"
	) -> dict:
	"""
		Receives a list of images supposedly to be sampled from a video, gives them
		to OpenAI API, and returns the analysis on them.

		Metadata is optional, and is provided as-is to the prompt to OpenAI
	"""

	# Get version config based on recommendation model version
	config = version_configs[version]

	# Prepare images in user message
	content = []
	content.append(
		{
			"type": "text",
			"text": """This is a transcript from a TikTok video. """
			"""Analyze this video in details using simple and to-the-point vocab using this json format: """
			f"""{ config.analysis_template }"""
			f"""Included is a metadata of the video for more things to analyze: {json.dumps(metadata)} """
			f"""Transcript: { transcript }"""
		})

	# Define headers
	headers = {
		"Content-Type": "application/json",
		"Authorization": f"Bearer { config.api_key }"
	}

	# Define payload
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
		headers: dict,
		config: dict,
	) -> str:

	logger.info(f"Sending request to LLM Provider with payload { payload }")

	try:
		payload_bytes = io.BytesIO(json.dumps(payload).encode('utf-8'))
		async with session.post(
			url=config.base_url,
			data=payload_bytes,
			headers=headers
		) as response:
			response_json = await response.json()

			logger.info(f"Reponse received from LLM Provider with code {response.status}: {json.dumps(response_json)}")

			analysis_raw = response_json["choices"][0]["message"]["content"]

			analysis_json = json.loads(analysis_raw)
			return analysis_json

	except ClientError as e:
		logger.error(f"ClientError during requesting LLM Provider: {e}")
		return {"error": "An error has happened"}
	
	except Exception as e:
		logger.error(f"Some happened during requesting LLM Provider: {e}")
		return {"error": "An error has happened"}
