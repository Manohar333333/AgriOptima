import os
import logging
from datetime import datetime, timezone

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.errors import PyMongoError

load_dotenv()

logger = logging.getLogger(__name__)

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "agrioptima")

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is not configured")

client = MongoClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=2000
)

database = client[MONGODB_DATABASE]
analysis_history: Collection = database["analysis_history"]


def check_database_connection() -> bool:
    """Check whether MongoDB is reachable."""
    try:
        client.admin.command("ping")
        return True
    except PyMongoError as exc:
        logger.error("MongoDB connection check failed: %s", exc)
        return False


def ensure_indexes() -> None:
    """Create indexes required by the application."""
    try:
        analysis_history.create_index(
            [("created_at", -1)],
            name="created_at_-1"
        )
    except PyMongoError as exc:
        logger.error("Failed to create MongoDB indexes: %s", exc)


def save_analysis(input_data: dict, output_data: dict) -> None:
    """Store one successful farm analysis."""
    document = {
        "created_at": datetime.now(timezone.utc),
        "input": input_data,
        "output": output_data,
    }

    try:
        analysis_history.insert_one(document)
    except PyMongoError as exc:
        logger.error("Failed to save farm analysis to MongoDB: %s", exc)