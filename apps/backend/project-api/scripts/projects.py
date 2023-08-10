
from stats import Stat

class Project:
	name: str = ""
	stats: list[Stat] = []

	def __init__(self, name: str, stats: list[Stat]) -> None:
		self.name = name
		self.stats = stats

	def fetch_new_stats_values() -> None:
		for stat in stats:
			stat.update()

	def __str__(self) -> str:
		return f"'{self.name}': [ {', '.join([str(stat) for stat in self.stats])} ]"

