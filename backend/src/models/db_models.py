import boto3

# AWS DynamoDB support
dynamodb = boto3.resource('dynamodb', region_name="us-east-1")
itinerary_table = dynamodb.Table('csc477-swipeandfly-itinerary')
