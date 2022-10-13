import os
from pymongo import MongoClient

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
	# if none has been updated, create a new one
	if (res.matched_count == 0):
		db.stats.insert_one({
			"project_id": project_id,
			"platform": platform,
			"name": name,
			"value": value,
			"url": ""
		})


def Connect(db_name):
	uri = os.environ["MONGO_URI"]
	if (not uri):
		raise Exception("MONGO_URI is not set")
	client = MongoClient(uri)
	if (not client):
		raise Exception("unable to connect to mongodb (check URI)")
	db = client[db_name]
	if (db == None):
		raise Exception("unable to find db " + db_name)
	return db