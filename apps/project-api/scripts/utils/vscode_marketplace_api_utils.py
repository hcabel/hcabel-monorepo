from datetime import datetime
from typing import List
from uuid import UUID
import requests

class Publisher:
	publisher_id: UUID
	publisher_name: str
	display_name: str
	flags: str
	domain: None
	is_domain_verified: bool

	def __init__(self, dict_publisher: dict) -> None:
		self.publisher_id = UUID(dict_publisher['publisherId'])
		self.publisher_name = dict_publisher['publisherName']
		self.display_name = dict_publisher['displayName']
		self.flags = dict_publisher['flags']
		self.domain = None
		self.is_domain_verified = dict_publisher['isDomainVerified']

class Statistic:
	statistic_name: str
	value: float

	def __init__(self, dict_statistic: dict) -> None:
		self.statistic_name = dict_statistic['statisticName']
		self.value = dict_statistic['value']

class Extension:
	publisher: Publisher
	extension_id: UUID
	extension_name: str
	display_name: str
	flags: str
	last_updated: datetime
	published_date: datetime
	release_date: datetime
	short_description: str
	statistics: List[Statistic]
	deployment_type: int

	def __init__(self, dict_extension: dict) -> None:
		self.publisher = Publisher(dict_extension['publisher'])
		self.extension_id = UUID(dict_extension['extensionId'])
		self.extension_name = dict_extension['extensionName']
		self.display_name = dict_extension['displayName']
		self.flags = dict_extension['flags']
		self.last_updated = datetime.strptime(dict_extension['lastUpdated'], '%Y-%m-%dT%H:%M:%S.%fZ')
		self.published_date = datetime.strptime(dict_extension['publishedDate'], '%Y-%m-%dT%H:%M:%S.%fZ')
		self.release_date = datetime.strptime(dict_extension['releaseDate'], '%Y-%m-%dT%H:%M:%S.%fZ')
		self.short_description = dict_extension['shortDescription']
		self.statistics = [Statistic(dict_statistic) for dict_statistic in dict_extension['statistics']]
		self.deployment_type = dict_extension['deploymentType']

class MetadataItem:
	name: str
	count: int

	def __init__(self, dict_metadata_item: dict) -> None:
		self.name = dict_metadata_item['name']
		self.count = dict_metadata_item['count']

class ResultMetadatum:
	metadata_type: str
	metadata_items: List[MetadataItem]

	def __init__(self, dict_result_metadatum: dict) -> None:
		self.metadata_type = dict_result_metadatum['metadataType']
		self.metadata_items = [MetadataItem(dict_metadata_item) for dict_metadata_item in dict_result_metadatum['metadataItems']]

class VsCodeResult:
	extensions: List[Extension]
	paging_token: None
	result_metadata: List[ResultMetadatum]

	def __init__(self, dict_vscode_result: dict) -> None:
		self.extensions = [Extension(dict_extension) for dict_extension in dict_vscode_result['extensions']]
		self.paging_token = None
		self.result_metadata = [ResultMetadatum(dict_result_metadatum) for dict_result_metadatum in dict_vscode_result['resultMetadata']]

class VsCodeResponse:
	results: List[VsCodeResult]

	def __init__(self, dict_vscode_response: dict) -> None:
		self.results = [VsCodeResult(dictResult) for dictResult in dict_vscode_response['results']]

def get_vscode_marketplace_data(extensionName: str) -> VsCodeResponse:
	dict_vscode_result = requests.post(
		"https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery?api-version=6.1-preview.1",
		json={
			"assetTypes": ["Microsoft.VisualStudio.Services.VSIXPackage"],
			"filters": [{
				"criteria": [{
					"filterType": 7, # 7 = ExtensionName
					"value": extensionName
				}]
			}],
			"flags": 0x100 # stat only
		}).json()
	return VsCodeResponse(dict_vscode_result)