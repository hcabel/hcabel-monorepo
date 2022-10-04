from utils.github_api_utils import get_github_repo_data
from utils.vscode_marketplace_api_utils import get_vscode_marketplace_data
from utils.mongo_db_utils import (
	Connect,
	update_stats
)

def update_uvch_stats_info(db) -> None:
	print("Updating UVCH project stats...")

	# fetch projects info
	uvch_github_repo = get_github_repo_data("https://api.github.com/repos/hcabel/UnrealVsCodeHelper")
	uvch_vscode_extension = get_vscode_marketplace_data("HugoCabel.uvch").results[0].extensions[0]

	# get project info
	uvch = db.projects.find_one({"name": "Unreal VsCode Helper"})
	if (not uvch):
		raise Exception("Failed to find project UVHC")

	# update github stats stars
	update_stats(db, uvch["_id"], "github", "stars", uvch_github_repo.stargazers_count)
	update_stats(db, uvch["_id"], "github", "forks", uvch_github_repo.forks)

	# update vscode stats
	update_stats(db, uvch["_id"], "vscode marketplace", "installs", int(uvch_vscode_extension.statistics[0].value))

	print("UVCH is now up to date!")

def main():
	# connect to db
	db = Connect()

	update_uvch_stats_info(db)

if (__name__ == "__main__"):
	main()