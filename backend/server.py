from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS, cross_origin

from openai import OpenAI

import boto3
from boto3.dynamodb.conditions import Key, Attr

import uuid, time, json, requests, os, random
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

# OpenAI API support
# client = OpenAI(api_key=settings.openapi_key)
client = OpenAI()
MODEL = "gpt-3.5-turbo"

# AWS DynamoDB support
dynamodb = boto3.resource('dynamodb', region_name="us-east-1")
itinerary_table = dynamodb.Table('Itineraries')

# HTTP codes
HTTP_OK = 200
HTTP_CREATED = 201
HTTP_BAD_REQUEST = 400
HTTP_INTERNAL_SERVER_ERROR = 500,
HTTP_NOT_IMPLEMENTED = 501

# Video analysis metadata
NUM_FRAMES_TO_SAMPLE = 3

'''
API calls setups
'''

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

'''
ROUTES
'''

'''
Use this call to test connection
'''
@app.route("/")
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/api/")
def api_status():
    return f"Backend is alive and well as of {time.ctime()}", 200


@app.route('/api/get_itinerary', methods=['GET'])
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

@app.route("/api/generate_itinerary", methods=['POST'])
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
    if len(videos) != 0:
        response = video_analysis_call(videos, dev=False)
        print("CALL OK")
        if response.status_code == HTTP_OK:
            print(response.json())
            video_summary = str(response.json()['video_analysis'])
            print(video_summary)
        else:
            return "Error with video analysis", HTTP_INTERNAL_SERVER_ERROR
        
    # Create system and user prompt
    system_prompt_file = open("./prompts/system_prompt_vid_analysis.txt", "r")
    system_prompt = system_prompt_file.read()

    user_prompt_file = open("./prompts/prompt_with_vid_analysis.txt", "r")
    user_prompt_template = user_prompt_file.read()
    user_prompt = user_prompt_template.replace("<user_prompt>", args_user_prompt).replace("<video_analysis>", video_summary)

    # OpenAI API call
    itinerary = openai_api_call(user_prompt, system_prompt)

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




if __name__ == "__main__":
    app.run(port=8080, debug=True)