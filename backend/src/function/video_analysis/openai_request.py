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

	if version == "openai":
		return await _block_analyze_images(session, base_64_list, config, metadata)
	elif version == "groq":
		return await _split_analyze_images(session, base_64_list, config, metadata)

async def _block_analyze_images(
		session: ClientSession,
		base_64_list: list,
  		config: dict,
		metadata: dict[str, str] = {},
    ):
		# Define headers
		headers = {
			"Content-Type": "application/json",
			"Authorization": f"Bearer { config['api_key'] }"
		}
		# Prepare content for messages
		content = []
		content.append(
			{
				"type": "text",
				"text": """These images are from a TikTok video. """
				"""Analyze this video using simple and to-the-point vocab using this json format: """
				f"""{ config["analysis_template"] }"""
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

		# Define payload
		payload = {
			"model": config["vision_model"],
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
		
		analysis_raw = await _send_request(session, payload, headers, config)
    
		analysis_json = json.loads(analysis_raw)
  
		return analysis_json

async def _split_analyze_images(
		session: ClientSession,
		base_64_list: list,
  		config: dict,
		metadata: dict[str, str] = {},
    ):
	
	# Define headers
	headers = {
		"Content-Type": "application/json",
		"Authorization": f"Bearer { config['api_key'] }"
	}
	analysis_list = []
	# Caption each images one by one
	for base64_image in base_64_list:
		payload = {
			"model": config["vision_model"],
			"messages": [
				{
					"role": "user",
					"content": [
						{
							"type": "text",
							"text": """This image is from a TikTok video. """
							"""Analyze this image using simple and to-the-point vocab but be as detailed as possible."""
							f"""Included is a metadata of the video for better analysis: {json.dumps(metadata)} """
						},
						{
							"type": "image_url",
							"image_url": {
								"detail": "low", # details low is around 20 tokens, while detail high is around 900 tokens
								"url": f"data:image/jpeg;base64,{base64_image}"
							}
						}
					]
				}
			],
			"max_tokens": 50
		}

		analysis_raw = await _send_request(session, payload, headers, config)
		analysis_list.append(analysis_raw)

	# Now put everything together to get the final analysis
	payload = {
		"model": config["vision_model"],
		"response_format": {
			"type": "json_object"
		},
		"messages": [
			{
				"role": "user",
				"content": [
					{
						"type": "text",
						"text": """You are a travel agent who knows how to give out good and personalized itinerary for their customers."""
						"""The user really wants do the stuff in the given TikTok video."""
						f"""Analyze the videos and create a list of at most 5 activities that you think they might like to do from the"""
						f"""given TikTok video and give out a json response using the following format {config["activity_list_template"]} and each activity should strictly contain the given fields."""
						"""Be as specific as possible about the activities and DO NOT DUPLICATE activity. You are given a list of captions of some of the images inside a TikTok video"""
						f"""Caption list: {analysis_list}"""
						f"""Included is a metadata of the video for better analysis: {json.dumps(metadata)} """
					},
					{
						"type": "image_url",
						"image_url": {
							"detail": "low", # details low is around 20 tokens, while detail high is around 900 tokens
							"url": f"data:image/jpeg;base64,{base64_image}"
						}
					}
				]
			}
		],
		"max_tokens": 1000
	}
	activity_list_raw = await _send_request(session, payload, headers, config)
 
	activity_list_json = json.loads(activity_list_raw)
 
	return activity_list_json
    

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
			f"""{ config["analysis_template"] }"""
			f"""Included is a metadata of the video for more things to analyze: {json.dumps(metadata)} """
			f"""Transcript: { transcript }"""
		})

	# Define headers
	headers = {
		"Content-Type": "application/json",
		"Authorization": f"Bearer { config['api_key'] }"
	}

	# Define payload
	payload = {
		"model": config["text_model"],
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
			url=f"{config['base_url']}/chat/completions",
			data=payload_bytes,
			headers=headers
		) as response:
			response_json = await response.json()

			logger.info(f"Reponse received from LLM Provider with code {response.status}: {json.dumps(response_json)}")

			analysis_raw = response_json["choices"][0]["message"]["content"]

			return analysis_raw

	except ClientError as e:
		logger.error(f"ClientError during requesting LLM Provider: {e}")
		return {"error": "An error has happened"}
	
	except Exception as e:
		logger.error(f"Some happened during requesting LLM Provider: {e}")
		return {"error": "An error has happened"}
