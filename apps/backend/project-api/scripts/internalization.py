
from enum import Enum

class Languages(Enum):
	EN = "en"
	FR = "fr"

class i18n:
	translations: dict[Languages, str] = {}

	def __init__(self, translations: dict[Languages, str] | str ) -> None:
		# if translations is a string, then it's the english translation
		if (isinstance(translations, str)):
			self.translations = { Languages.EN: translations }
		else:
			self.translations = translations

	def to_mongo(self) -> dict:
		return { lang.value: self.translations[lang] for lang in self.translations }

	def __str__(self) -> str:
		return str(self.translations[Languages.EN])