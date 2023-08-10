from dotenv import load_dotenv
from utils.github_api_utils import get_github_repo_data
from utils.vscode_marketplace_api_utils import get_vscode_marketplace_data
from utils.youtube_api_utils import get_youtube_video_data
from utils.mongo_db_utils import (
	Connect,
	update_stats
)

from projects import Project
from stats import (
	GitHubStars,
	GithubForks,
	YoutubeViews,
	YoutubeViewsFr,
	YoutubeViewsEn,
	VsCodeInstalls
)

def main():
	# connect to db
	db = Connect()

	projects = [
		Project("Unreal VsCode Helper", [
			GitHubStars("hcabel", "UnrealVsCodeHelper"),
			GithubForks("hcabel", "UnrealVsCodeHelper"),
			VsCodeInstalls("HugoCabel.uvch"),
			YoutubeViews("https://www.youtube.com/watch?v=_usDZ6osnR4")
		]),
		Project("HugoMeet", [
			GitHubStars("hcabel", "HugoMeet"),
			GithubForks("hcabel", "HugoMeet"),
			YoutubeViewsFr("https://www.youtube.com/watch?v=XQ5PZToo1qo"),
			YoutubeViewsEn("https://www.youtube.com/watch?v=2oupECsHxPU")
		]),
		Project("Procedural Terrain", [
			YoutubeViews("https://www.youtube.com/watch?v=MHB8Tn3zbqM")
		])
	]

	# get all projects in the db
	projects_in_db = db.projects.find()
	# convert to list
	projects_in_db = list(projects_in_db)

	for project in projects:

		# retrieve project in db
		project_in_db = None
		for project_db in projects_in_db:
			if (project_db["name"] == project.name):
				project_in_db = project_db
				break

		if (not project_in_db):
			print(f"Error: project not found in db '{project.name}'")
			continue

		# update the stats in the db
		for stat in project.stats:
			stat.update()
			update_stats(db, project_in_db["_id"], stat.platform, stat.name, stat.value, stat.get_url())
			print(f"Updated stat: {project.name}: {stat}")

if (__name__ == "__main__"):
	load_dotenv()
	main()