import uuid
import time
import json
import requests
import os
import random


from flask import Blueprint, request, jsonify
from src.shared import *
from openai import OpenAI
from boto3.dynamodb.conditions import Key
from src.models.db_models import itinerary_table
from src.shared.video_analysis import analyze_videos

itinerary_bp = Blueprint("itinerary", __name__)

# OpenAI API support
# client = OpenAI(api_key=settings.openapi_key)
client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("GROQ_API_KEY")
)
MODEL = "llama-3.3-70b-versatile"

# Get the first completion of the call
def openai_api_call(user_prompt, system_prompt):
    # Generate an itinerary from OpenAI
    completion = client.chat.completions.create(
        model = MODEL,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    return str(completion.choices[0].message.content)

# Get a response from video analysis API
def video_analysis_call(videos, dev=False):
    api_json = json.dumps({
        "video_urls": videos,
        "num_frames_to_sample": NUM_FRAMES_TO_SAMPLE
    })
    url = os.environ["VIDEO_ANALYSIS_DEV_URL"] if dev==True else os.environ["VIDEO_ANALYSIS_PROD_URL"]
    response = requests.post(
        url=url,
        headers={'Content-Type': 'application/json'},
        data=api_json
    )
    return response

@itinerary_bp.route('/api/itinerary/get_itinerary', methods=['GET'])
def get_itinerary():
    # Process params
    id = request.args.get('uuid')
    if id == "":
        return "Error: You must specify an UUID.", HTTP_BAD_REQUEST
    fields = request.args.get('fields')
    if fields == "":
        return "Error: You must specify fields.", HTTP_BAD_REQUEST
    
    # Get a response from DynamoDB
    response = itinerary_table.query(
        KeyConditionExpression=Key('id').eq(id),
        ProjectionExpression=fields
    )

    return response['Items'][0], HTTP_OK

@itinerary_bp.route("/api/itinerary/generate_itinerary", methods=['POST'])
def generate_itinerary():
    # Process arguments
    args_user_prompt = request.args.get("prompt")
    if args_user_prompt == "":
        return jsonify("Error: No prompt found"), HTTP_BAD_REQUEST
    videos = request.args.get('video_urls').split(',')
    
    # If videos have more than 5, take 5 random ones
    if(len(videos) > 5):
        videos = random.sample(videos, 5)

    # Video processing 
    video_summary = "The user have not specified any videos."
    # if len(videos) != 0:
    #     try:
    #         print("Analyzing videos")
    #         video_summary = analyze_videos(videos, NUM_FRAMES_TO_SAMPLE, metadata_fields=["title"])
    #         print(video_summary)
    #         video_summary = str(video_summary)
    #     except:
    #         return "Error with video analysis", HTTP_INTERNAL_SERVER_ERROR
    
    print("finished analyzing")
    # Create system and user prompt
    system_prompt_file = open("./src/prompts/system_prompt_vid_analysis.txt", "r")
    system_prompt = system_prompt_file.read()

    user_prompt_file = open("./src/prompts/prompt_with_vid_analysis.txt", "r")
    user_prompt_template = user_prompt_file.read()
    user_prompt = user_prompt_template.replace("<user_prompt>", args_user_prompt).replace("<video_analysis>", video_summary)

    print(user_prompt)

    # OpenAI API call
    itinerary = openai_api_call(user_prompt, system_prompt)

    print(itinerary)

    # Put the itinerary in DynamoDB, generating other fields
    itinerary_uuid = str(uuid.uuid4())
    itinerary_timestamp = str(time.time())

    itinerary_table.put_item(
        Item={
            'id': itinerary_uuid,
            'timestamp': itinerary_timestamp,
            'itinerary': itinerary,
            'prompt': user_prompt
        }
    )

    return itinerary_uuid, HTTP_CREATED


