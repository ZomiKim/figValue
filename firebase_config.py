import json
import os

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


def _load_credential():
    json_str = os.environ.get("FIREBASE_CREDENTIALS_JSON")
    if json_str:
        return credentials.Certificate(json.loads(json_str))
    return credentials.Certificate("firebase_key.json")


if not firebase_admin._apps:
    firebase_admin.initialize_app(_load_credential())

db = firestore.client()
