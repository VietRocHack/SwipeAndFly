from flask import Blueprint, send_from_directory
from shared import *

itinerary_bp = Blueprint("itinerary", __name__)

@itinerary_bp.route('/api/get_itinerary', methods=['GET'])
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

@itinerary_bp.route("/api/generate_itinerary", methods=['POST'])
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


