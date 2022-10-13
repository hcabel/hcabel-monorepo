from dotenv import load_dotenv
from utils.github_api_utils import get_github_repo_data
from utils.vscode_marketplace_api_utils import get_vscode_marketplace_data
from utils.youtube_api_utils import get_youtube_video_data
from utils.mongo_db_utils import (
	Connect,
	update_stats
)

def update_uvch_stats_info(db) -> None:
	print("Updating UVCH project stats...")

	# fetch projects info
	uvch_github_repo = get_github_repo_data("https://api.github.com/repos/hcabel/UnrealVsCodeHelper")
	uvch_vscode_extension = get_vscode_marketplace_data("HugoCabel.uvch").results[0].extensions[0]
	uvch_youtube_video = get_youtube_video_data("https://www.youtube.com/watch?v=_usDZ6osnR4")

	# get project info
	uvch = db.projects.find_one({"name": "Unreal VsCode Helper"})
	if (not uvch):
		raise Exception("Failed to find project UVHC")

	# update github stats stars
	update_stats(db, uvch["_id"], "github", "stars", uvch_github_repo.stargazers_count)
	update_stats(db, uvch["_id"], "github", "forks", uvch_github_repo.forks)

	# update vscode stats
	update_stats(db, uvch["_id"], "vscode marketplace", "installs", int(uvch_vscode_extension.statistics[0].value))

	# update youtube stats
	update_stats(db, uvch["_id"], "youtube", "views", int(uvch_youtube_video.items[0].statistics.view_count))

	print("UVCH is now up to date!")

def update_hugomeet_stats_info(db) -> None:
	print("Updating HugoMeet project stats...")

	# fetch projects info
	hugomeet_github_repo = get_github_repo_data("https://api.github.com/repos/hcabel/HugoMeet")
	hugomeet_youtube_video_fr = get_youtube_video_data("https://www.youtube.com/watch?v=XQ5PZToo1qo")
	hugomeet_youtube_video_en = get_youtube_video_data("https://www.youtube.com/watch?v=2oupECsHxPU")

	# get project info
	hugomeet = db.projects.find_one({"name": "HugoMeet"})
	if (not hugomeet):
		raise Exception("Failed to find project UVHC")

	# update github stats stars
	update_stats(db, hugomeet["_id"], "github", "stars", hugomeet_github_repo.stargazers_count)
	update_stats(db, hugomeet["_id"], "github", "forks", hugomeet_github_repo.forks)

	# update youtube stats
	update_stats(db, hugomeet["_id"], "youtube", "views - fr", int(hugomeet_youtube_video_fr.items[0].statistics.view_count))
	update_stats(db, hugomeet["_id"], "youtube", "views - en", int(hugomeet_youtube_video_en.items[0].statistics.view_count))

	print("HugoMeet is now up to date!")

def update_procedural_terrain_stats_info(db) -> None:
	print("Updating Procedural Terrain project stats...")

	# fetch projects info
	procedural_terrain_youtube_video = get_youtube_video_data("https://www.youtube.com/watch?v=MHB8Tn3zbqM&t=157s")

	# get project info
	procedural_terrain = db.projects.find_one({"name": "Procedural Terrain"})
	if (not procedural_terrain):
		raise Exception("Failed to find project UVHC")

	# update youtube stats
	update_stats(db, procedural_terrain["_id"], "youtube", "views", int(procedural_terrain_youtube_video.items[0].statistics.view_count))

	print("Procedural Terrain is now up to date!")

def main():
	# connect to db
	db = Connect("dev")

	update_uvch_stats_info(db)
	update_hugomeet_stats_info(db)
	update_procedural_terrain_stats_info(db)

if (__name__ == "__main__"):
	load_dotenv()
	main()