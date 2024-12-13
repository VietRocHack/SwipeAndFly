import json
from openai import OpenAI
from src.function.video_analysis.shared.const import version_configs

def suggest_activities(
    summaries: list,
    detected_activities: list,
    pref_rank: list,
    user_prompt: str,
    version: str = "openai"
    ):
    
    config = version_configs[version]
    
    ranked_activities = rank_activities(detected_activities, pref_rank)
    
    client = OpenAI(
        base_url=config["base_url"],
        api_key=config["api_key"]
    )
    
    
    # Create system and user prompt
    with open("./src/function/itinerary/prompts/itinerary_system_prompt.txt", "r") as file:
        system_prompt = file.read()

    with open("./src/function/itinerary/prompts/itinerary_user_prompt.txt", "r") as file:
        user_prompt_template = file.read()

    user_prompt = user_prompt_template.replace("<user_prompt>", user_prompt).replace("<video_analysis>", json.dumps(summaries)).replace("<ranked_activities>", json.dumps(ranked_activities))
    
    completion = client.chat.completions.create(
        model = config["text_model"],
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    return json.loads(completion.choices[0].message.content)
    
    

def rank_activities(
    activities: list,
    pref_rank: list,
):
    return activities



