from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "hcabel_dev"

def update_stats(db, project_id: str, platform: str, name: str, value: str) -> None:
	res = db.stats.update_one(
		{
			"project_id": project_id,
			"platform": platform,
			"name": name
		},
		{
			"$set": { "value": value }
		}
	)
	if (res.matched_count == 0):
		raise Exception(f"Could not find stats for project_id: {project_id}, platform: {platform}, name: {name}")\

def Connect():
	client = MongoClient(MONGO_URI)
	if (not client):
		raise Exception("unable to connect to mongodb (check URI)")
	db = client[DB_NAME]
	if (db == None):
		raise Exception("unable to find db " + DB_NAME)
	return db