from datetime import datetime
from typing import List
import requests


class License:
	key: str
	name: str
	spdx_id: str
	url: str
	node_id: str

	def __init__(self, dict_license: dict) -> None:
		self.key = dict_license['key']
		self.name = dict_license['name']
		self.spdx_id = dict_license['spdx_id']
		self.url = dict_license['url']
		self.node_id = dict_license['node_id']

class Owner:
	login: str
	id: int
	node_id: str
	avatar_url: str
	gravatar_id: str
	url: str
	html_url: str
	followers_url: str
	following_url: str
	gists_url: str
	starred_url: str
	subscriptions_url: str
	organizations_url: str
	repos_url: str
	events_url: str
	received_events_url: str
	type: str
	site_admin: bool

	def __init__(self, dict_owner: dict) -> None:
		self.login = dict_owner['login']
		self.id = dict_owner['id']
		self.node_id = dict_owner['node_id']
		self.avatar_url = dict_owner['avatar_url']
		self.gravatar_id = dict_owner['gravatar_id']
		self.url = dict_owner['url']
		self.html_url = dict_owner['html_url']
		self.followers_url = dict_owner['followers_url']
		self.following_url = dict_owner['following_url']
		self.gists_url = dict_owner['gists_url']
		self.starred_url = dict_owner['starred_url']
		self.subscriptions_url = dict_owner['subscriptions_url']
		self.organizations_url = dict_owner['organizations_url']
		self.repos_url = dict_owner['repos_url']
		self.events_url = dict_owner['events_url']
		self.received_events_url = dict_owner['received_events_url']
		self.type = dict_owner['type']
		self.site_admin = dict_owner['site_admin']

class GithubResponse:
	id: int
	node_id: str
	name: str
	full_name: str
	private: bool
	owner: Owner
	html_url: str
	description: str
	fork: bool
	url: str
	forks_url: str
	keys_url: str
	collaborators_url: str
	teams_url: str
	hooks_url: str
	issue_events_url: str
	events_url: str
	assignees_url: str
	branches_url: str
	tags_url: str
	blobs_url: str
	git_tags_url: str
	git_refs_url: str
	trees_url: str
	statuses_url: str
	languages_url: str
	stargazers_url: str
	contributors_url: str
	subscribers_url: str
	subscription_url: str
	commits_url: str
	git_commits_url: str
	comments_url: str
	issue_comment_url: str
	contents_url: str
	compare_url: str
	merges_url: str
	archive_url: str
	downloads_url: str
	issues_url: str
	pulls_url: str
	milestones_url: str
	notifications_url: str
	labels_url: str
	releases_url: str
	deployments_url: str
	created_at: datetime
	updated_at: datetime
	pushed_at: datetime
	git_url: str
	ssh_url: str
	clone_url: str
	svn_url: str
	homepage: str
	size: int
	stargazers_count: int
	watchers_count: int
	language: str
	has_issues: bool
	has_projects: bool
	has_downloads: bool
	has_wiki: bool
	has_pages: bool
	forks_count: int
	mirror_url: None
	archived: bool
	disabled: bool
	open_issues_count: int
	license: License | None
	allow_forking: bool
	is_template: bool
	web_commit_signoff_required: bool
	topics: List[str]
	visibility: str
	forks: int
	open_issues: int
	watchers: int
	default_branch: str
	temp_clone_token: None
	network_count: int
	subscribers_count: int

	def __init__(self, dict_github_response: dict) -> None:
		self.id = dict_github_response['id']
		self.node_id = dict_github_response['node_id']
		self.name = dict_github_response['name']
		self.full_name = dict_github_response['full_name']
		self.private = dict_github_response['private']
		self.owner = Owner(dict_github_response['owner'])
		self.html_url = dict_github_response['html_url']
		self.description = dict_github_response['description']
		self.fork = dict_github_response['fork']
		self.url = dict_github_response['url']
		self.forks_url = dict_github_response['forks_url']
		self.keys_url = dict_github_response['keys_url']
		self.collaborators_url = dict_github_response['collaborators_url']
		self.teams_url = dict_github_response['teams_url']
		self.hooks_url = dict_github_response['hooks_url']
		self.issue_events_url = dict_github_response['issue_events_url']
		self.events_url = dict_github_response['events_url']
		self.assignees_url = dict_github_response['assignees_url']
		self.branches_url = dict_github_response['branches_url']
		self.tags_url = dict_github_response['tags_url']
		self.blobs_url = dict_github_response['blobs_url']
		self.git_tags_url = dict_github_response['git_tags_url']
		self.git_refs_url = dict_github_response['git_refs_url']
		self.trees_url = dict_github_response['trees_url']
		self.statuses_url = dict_github_response['statuses_url']
		self.languages_url = dict_github_response['languages_url']
		self.stargazers_url = dict_github_response['stargazers_url']
		self.contributors_url = dict_github_response['contributors_url']
		self.subscribers_url = dict_github_response['subscribers_url']
		self.subscription_url = dict_github_response['subscription_url']
		self.commits_url = dict_github_response['commits_url']
		self.git_commits_url = dict_github_response['git_commits_url']
		self.comments_url = dict_github_response['comments_url']
		self.issue_comment_url = dict_github_response['issue_comment_url']
		self.contents_url = dict_github_response['contents_url']
		self.compare_url = dict_github_response['compare_url']
		self.merges_url = dict_github_response['merges_url']
		self.archive_url = dict_github_response['archive_url']
		self.downloads_url = dict_github_response['downloads_url']
		self.issues_url = dict_github_response['issues_url']
		self.pulls_url = dict_github_response['pulls_url']
		self.milestones_url = dict_github_response['milestones_url']
		self.notifications_url = dict_github_response['notifications_url']
		self.labels_url = dict_github_response['labels_url']
		self.releases_url = dict_github_response['releases_url']
		self.deployments_url = dict_github_response['deployments_url']
		self.created_at = datetime.strptime(dict_github_response['created_at'], '%Y-%m-%dT%H:%M:%SZ')
		self.updated_at = datetime.strptime(dict_github_response['updated_at'], '%Y-%m-%dT%H:%M:%SZ')
		self.pushed_at = datetime.strptime(dict_github_response['pushed_at'], '%Y-%m-%dT%H:%M:%SZ')
		self.git_url = dict_github_response['git_url']
		self.ssh_url = dict_github_response['ssh_url']
		self.clone_url = dict_github_response['clone_url']
		self.svn_url = dict_github_response['svn_url']
		self.homepage = dict_github_response['homepage']
		self.size = dict_github_response['size']
		self.stargazers_count = dict_github_response['stargazers_count']
		self.watchers_count = dict_github_response['watchers_count']
		self.language = dict_github_response['language']
		self.has_issues = dict_github_response['has_issues']
		self.has_projects = dict_github_response['has_projects']
		self.has_downloads = dict_github_response['has_downloads']
		self.has_wiki = dict_github_response['has_wiki']
		self.has_pages = dict_github_response['has_pages']
		self.forks_count = dict_github_response['forks_count']
		self.mirror_url = dict_github_response['mirror_url']
		self.archived = dict_github_response['archived']
		self.disabled = dict_github_response['disabled']
		self.open_issues_count = dict_github_response['open_issues_count']
		self.license = License(dict_github_response['license']) if dict_github_response['license'] else None
		self.allow_forking = dict_github_response['allow_forking']
		self.is_template = dict_github_response['is_template']
		self.web_commit_signoff_required = dict_github_response['web_commit_signoff_required']
		self.topics = dict_github_response['topics']
		self.visibility = dict_github_response['visibility']
		self.forks = dict_github_response['forks']
		self.open_issues = dict_github_response['open_issues']
		self.watchers = dict_github_response['watchers']
		self.default_branch = dict_github_response['default_branch']
		self.temp_clone_token = dict_github_response['temp_clone_token']
		self.network_count = dict_github_response['network_count']
		self.subscribers_count = dict_github_response['subscribers_count']

def get_github_repo_data(RepoUrl: str) -> GithubResponse:
	github_response = requests.get(RepoUrl).json();
	return GithubResponse(github_response)