import uuid
import time
import json
import requests
import os
import random


from flask import Blueprint, request, jsonify
from src.shared import *
from src.models.db_models import itinerary_collection
from src.shared.video_analysis import analyze_videos
from src.function.itinerary.activity import suggest_activities

itinerary_bp = Blueprint("itinerary", __name__)

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

    # Get a response from Firestore
    doc = itinerary_collection.document(id).get(field_paths=fields.split(','))

    return doc.to_dict(), HTTP_OK

@itinerary_bp.route("/api/itinerary/generate_itinerary", methods=['POST'])
def generate_itinerary():
    # Process arguments
    args_user_prompt = request.args.get("prompt")
    args_pref_rank = request.args.get("activityTags")
    
    rec_version = request.args.get("version", "gemini")

    print(f"Currently recommending with version {rec_version}")
    
    if args_user_prompt == "":
        return jsonify("Error: No prompt found"), HTTP_BAD_REQUEST
    videos = request.args.get('video_urls').split(',')
    
    # If videos have more than 5, take 5 random ones
    if(len(videos) > 5):
        videos = random.sample(videos, 5)

    # Video processing 
    video_analysis = "The user have not specified any videos."
    if len(videos) != 0:
        try:
            print("Analyzing videos")
            video_analysis = analyze_videos(
                videos,
                NUM_FRAMES_TO_SAMPLE,
                metadata_fields=["title"],
                version=rec_version
            )
            print(video_analysis)
            # video_summary = str(video_summary)
        except:
            return "Error with video analysis", HTTP_INTERNAL_SERVER_ERROR
    
    summaries = []
    detected_activities = []
    
    for analysis in video_analysis:
        # "groq"'s split-flow analysis returns {summary, activities}; the
        # default "gemini"/"openai" analysis returns {content, location}
        # instead (see openai_analysis_json_template.txt) - no activities
        # list of its own.
        summaries.append(analysis.get("summary", analysis.get("content", "")))

        detected_activities.extend(analysis.get("activities", []))
    
    print(summaries)
    print(detected_activities)
    
    # OpenAI API call
    itinerary = suggest_activities(summaries, detected_activities, args_pref_rank, args_user_prompt, rec_version)

    print("itinerary", itinerary)

    # Put the itinerary in Firestore, generating other fields
    itinerary_uuid = str(uuid.uuid4())
    itinerary_timestamp = str(time.time())

    itinerary_collection.document(itinerary_uuid).set({
        'id': itinerary_uuid,
        'timestamp': itinerary_timestamp,
        'itinerary': itinerary,
        'prompt': args_user_prompt
    })

    return itinerary_uuid, HTTP_CREATED


