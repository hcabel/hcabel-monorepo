from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

import urllib.parse as p
import re
import os
import pickle

from datetime import datetime
from typing import List


class ContentRating:
	pass

	def __init__(self, ) -> None:
		pass


class ContentDetails:
	duration: str
	dimension: str
	definition: str
	caption: bool
	licensed_content: bool
	content_rating: ContentRating
	projection: str

	def __init__(self, dict_content_details: dict) -> None:
		self.duration = dict_content_details['duration']
		self.dimension = dict_content_details['dimension']
		self.definition = dict_content_details['definition']
		self.caption = dict_content_details['caption']
		self.licensed_content = dict_content_details['licensedContent']
		self.content_rating = ContentRating()
		self.projection = dict_content_details['projection']

class Localized:
	title: str
	description: str

	def __init__(self, dict_localized: dict) -> None:
		self.title = dict_localized['title']
		self.description = dict_localized['description']


class Default:
	url: str
	width: int
	height: int

	def __init__(self, dict_default: dict) -> None:
		self.url = dict_default['url']
		self.width = dict_default['width']
		self.height = dict_default['height']

class Thumbnails:
	default: Default
	medium: Default
	high: Default
	standard: Default
	maxres: Default

	def __init__(self, dict_thumbnail: dict) -> None:
		self.default = Default(dict_thumbnail['default'])
		self.medium = Default(dict_thumbnail['medium'])
		self.high = Default(dict_thumbnail['high'])
		self.standard = Default(dict_thumbnail['standard'])
		self.maxres = Default(dict_thumbnail['maxres'])


class Snippet:
	published_at: datetime
	channel_id: str
	title: str
	description: str
	thumbnails: Thumbnails
	channel_title: str
	tags: List[str]
	category_id: int
	live_broadcast_content: str
	default_language: str
	localized: Localized
	default_audio_language: str

	def __init__(self, dict_snippet: dict) -> None:
		self.published_at = datetime.strptime(dict_snippet['publishedAt'], '%Y-%m-%dT%H:%M:%SZ')
		self.channel_id = dict_snippet['channelId']
		self.title = dict_snippet['title']
		self.description = dict_snippet['description']
		self.thumbnails = Thumbnails(dict_snippet['thumbnails'])
		self.channel_title = dict_snippet['channelTitle']
		self.tags = dict_snippet['tags']
		self.category_id = dict_snippet['categoryId']
		self.live_broadcast_content = dict_snippet['liveBroadcastContent']
		self.default_language = dict_snippet['defaultLanguage']
		self.localized = Localized(dict_snippet['localized'])
		self.default_audio_language = dict_snippet['defaultAudioLanguage']


class Statistics:
	view_count: int
	like_count: int
	favorite_count: int
	comment_count: int

	def __init__(self, dict_statistics: dict) -> None:
		self.view_count = dict_statistics['viewCount']
		self.like_count = dict_statistics['likeCount']
		self.favorite_count = dict_statistics['favoriteCount']
		self.comment_count = dict_statistics['commentCount']


class Item:
	kind: str
	etag: str
	id: str
	snippet: Snippet
	content_details: ContentDetails
	statistics: Statistics

	def __init__(self, dict_item: dict) -> None:
		self.kind = dict_item['kind']
		self.etag = dict_item['etag']
		self.id = dict_item['id']
		self.snippet = Snippet(dict_item['snippet'])
		self.content_details = ContentDetails(dict_item['contentDetails'])
		self.statistics = Statistics(dict_item['statistics'])


class PageInfo:
	total_results: int
	results_per_page: int

	def __init__(self, dict_page_info: dict) -> None:
		self.total_results = dict_page_info['totalResults']
		self.results_per_page = dict_page_info['resultsPerPage']


class YoutubeResponse:
	kind: str
	etag: str
	items: List[Item]
	page_info: PageInfo

	def __init__(self, dict_youtube_response: dict) -> None:
		self.kind = dict_youtube_response['kind']
		self.etag = dict_youtube_response['etag']
		self.items = [Item(item) for item in dict_youtube_response['items']]
		self.page_info = PageInfo(dict_youtube_response['pageInfo'])


SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]

def youtube_authenticate_oauth():
	os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
	api_service_name = "youtube"
	api_version = "v3"
	client_secrets_file = "credentials.json"
	creds = None
	# the file token.pickle stores the user's access and refresh tokens, and is
	# created automatically when the authorization flow completes for the first time
	if os.path.exists("token.pickle"):
		with open("token.pickle", "rb") as token:
			creds = pickle.load(token)
	# if there are no (valid) credentials availablle, let the user log in.
	if not creds or not creds.valid:
		if creds and creds.expired and creds.refresh_token:
			creds.refresh(Request())
		else:
			flow = InstalledAppFlow.from_client_secrets_file(client_secrets_file, SCOPES)
			creds = flow.run_local_server(port=0)
		# save the credentials for the next run
		with open("token.pickle", "wb") as token:
			pickle.dump(creds, token)

	return build(api_service_name, api_version, credentials=creds)

def youtube_authenticate_apikey():
	api_service_name = "youtube"
	api_version = "v3"
	api_key = os.environ["YOUTUBE_API_KEY"]
	if (not api_key):
		raise Exception("No API key provided")
	return build(api_service_name, api_version, developerKey=api_key)

def get_channel_details(youtube, **kwargs):
	return youtube.channels().list(
		part="statistics,snippet,contentDetails",
		**kwargs
	).execute()


def search(youtube, **kwargs):
	return youtube.search().list(
		part="snippet",
		**kwargs
	).execute()


def get_video_details(youtube, **kwargs) -> YoutubeResponse:
	return YoutubeResponse(youtube.videos().list(
		part="snippet,contentDetails,statistics",
		**kwargs
	).execute())


def print_video_infos(video_response: YoutubeResponse):
	items = video_response.items[0]
	# get the snippet, statistics & content details from the video response
	snippet         = items.snippet
	statistics      = items.statistics
	content_details = items.content_details
	# get infos from the snippet
	channel_title = snippet.channel_title
	title         = snippet.title
	description   = snippet.description
	publish_time  = snippet.published_at
	# get stats infos
	comment_count = statistics.comment_count
	like_count    = statistics.like_count
	view_count    = statistics.view_count
	# get duration from content details
	duration = content_details.duration
	# duration in the form of something like 'PT5H50M15S'
	# parsing it to be something like '5:50:15'
	parsed_duration = re.search(f"PT(\d+H)?(\d+M)?(\d+S)", duration).groups()
	duration_str = ""
	for d in parsed_duration:
		if d:
			duration_str += f"{d[:-1]}:"
	duration_str = duration_str.strip(":")
	print(f"""
	Title: {title}
	Description: {description}
	Channel Title: {channel_title}
	Publish time: {publish_time}
	Duration: {duration_str}
	Number of comments: {comment_count}
	Number of likes: {like_count}
	Number of views: {view_count}
	""")


def parse_channel_url(url):
	"""
	This function takes channel `url` to check whether it includes a
	channel ID, user ID or channel name
	"""
	path = p.urlparse(url).path
	id = path.split("/")[-1]
	if "/c/" in path:
		return "c", id
	elif "/channel/" in path:
		return "channel", id
	elif "/user/" in path:
		return "user", id


def get_channel_id_by_url(youtube, url):
	"""
	Returns channel ID of a given `id` and `method`
	- `method` (str): can be 'c', 'channel', 'user'
	- `id` (str): if method is 'c', then `id` is display name
		if method is 'channel', then it's channel id
		if method is 'user', then it's username
	"""
	# parse the channel URL
	method, id = parse_channel_url(url)
	if method == "channel":
		# if it's a channel ID, then just return it
		return id
	elif method == "user":
		# if it's a user ID, make a request to get the channel ID
		response = get_channel_details(youtube, forUsername=id)
		items = response.get("items")
		if items:
			channel_id = items[0].get("id")
			return channel_id
	elif method == "c":
		# if it's a channel name, search for the channel using the name
		# may be inaccurate
		response = search(youtube, q=id, maxResults=1)
		items = response.get("items")
		if items:
			channel_id = items[0]["snippet"]["channelId"]
			return channel_id
	raise Exception(f"Cannot find ID:{id} with {method} method")


def get_video_id_by_url(url):
	"""
	Return the Video ID from the video `url`
	"""
	# split URL parts
	parsed_url = p.urlparse(url)
	# get the video ID by parsing the query of the URL
	video_id = p.parse_qs(parsed_url.query).get("v")
	if video_id:
		return video_id[0]
	else:
		raise Exception(f"Wasn't able to parse video URL: {url}")



def get_youtube_video_data(video_url: str) -> YoutubeResponse | None:
	api_service = youtube_authenticate_apikey()
	if (api_service):
		video_id = get_video_id_by_url(video_url)
		video_details = get_video_details(api_service, id=video_id)
		if (video_details):
			return video_details
	return None