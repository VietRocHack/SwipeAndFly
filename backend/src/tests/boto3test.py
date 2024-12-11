import boto3

import uuid, time

dynamodb = boto3.client('dynamodb')

testjson = {
    "activities": [
        {
            "startTime": "07:00",
            "endTime": "09:00",
            "activity": "Visit George Eastman Museum",
            "location": "Rochester, NY"
        },
        {
            "startTime": "09:30",
            "endTime": "11:30",
            "activity": "Explore Strong National Museum of Play",
            "location": "Rochester, NY"
        },
        {
            "startTime": "12:00",
            "endTime": "13:00",
            "activity": "Lunch",
            "location": "Downtown Rochester, NY"
        },
    ]
}

dynamodb.put_item(
    TableName='Itineraries',
    Item={
        'id': {'S': str(uuid.uuid4())},
        'timestamp': {'S': str(time.time())},
        'itinerary': {'S': str(testjson)}
    }
)
