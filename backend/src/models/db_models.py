from google.cloud import firestore

# Firestore support (dedicated "swipeandfly" database in the vietrochack-lab project)
db = firestore.Client(database="swipeandfly")
itinerary_collection = db.collection("itineraries")
