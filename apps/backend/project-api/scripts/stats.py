
from internalization import (
	Languages,
	i18n,
)

from utils.github_api_utils import get_github_repo_data
from utils.vscode_marketplace_api_utils import get_vscode_marketplace_data
from utils.youtube_api_utils import get_youtube_video_data

class Stat:
	value: int = 0
	name: i18n
	platform: str = ""

	def __init__(self, name: i18n | str) -> None:
		if (isinstance(name, str)):
			self.name = i18n(name)
		else:
			self.name = name

	def fetch_new_value(self) -> int:
		raise NotImplementedError()

	def update(self) -> None:
		self.value = self.fetch_new_value()
		print("Updated stat: " + str(self))

	def __str__(self) -> str:
		return f"'{self.name}': {self.value}"

	def get_url(self) -> str:
		return ""

class GithubStats(Stat):
	author: str = ""
	repoName: str = ""

	def __init__(self, name: i18n | str, author: str, repoName: str) -> None:
		super().__init__(name)
		self.platform = "github"
		self.author = author
		self.repoName = repoName

	def get_api_url(self) -> str:
		return f"https://api.github.com/repos/{self.author}/{self.repoName}"

	def get_url(self) -> str:
		return f"https://github.com/{self.author}/{self.repoName}"

class GitHubStars(GithubStats):
	def __init__(self, author: str, repoName: str) -> None:
		super().__init__(
			i18n({
				Languages.EN: "Stars",
				Languages.FR: "Étoiles",
			}),
			author,
			repoName
		)

	def fetch_new_value(self) -> int:
		data = get_github_repo_data(self.get_api_url())
		return data.stargazers_count

class GithubForks(GithubStats):
	def __init__(self, author: str, repoName: str) -> None:
		super().__init__(
			i18n({
				Languages.EN: "Forks",
				Languages.FR: "Forks",
			}),
			author,
			repoName
		)

	def fetch_new_value(self) -> int:
		data = get_github_repo_data(self.get_api_url())
		return data.forks

class YoutubeViews(Stat):
	videoUrl: str = ""

	def __init__(self, videoUrl: str) -> None:
		super().__init__(
			i18n({
				Languages.EN: "Views",
				Languages.FR: "Vues",
			})
		)
		self.platform = "youtube"
		self.videoUrl = videoUrl

	def fetch_new_value(self) -> int:
		data = get_youtube_video_data(self.videoUrl)
		return data.items[0].statistics.view_count

	def get_url(self) -> str:
		return self.videoUrl

class YoutubeViewsFr(YoutubeViews):
	def __init__(self, videoUrl: str) -> None:
		super().__init__(videoUrl)
		self.name = i18n({
			Languages.EN: "Views - fr",
			Languages.FR: "Vues - fr",
		})

class YoutubeViewsEn(YoutubeViews):
	def __init__(self, videoUrl: str) -> None:
		super().__init__(videoUrl)
		self.name = i18n({
			Languages.EN: "Views - en",
			Languages.FR: "Vues - en",
		})

class VsCodeInstalls(Stat):
	extensionId: str = ""

	def __init__(self, extensionId: str) -> None:
		super().__init__(
			i18n({
				Languages.EN: "Installs",
				Languages.FR: "Installations",
			})
		)
		self.platform = "vscode marketplace"
		self.extensionId = extensionId

	def fetch_new_value(self) -> int:
		data = get_vscode_marketplace_data(self.extensionId).results[0].extensions[0]
		return data.statistics[0].value