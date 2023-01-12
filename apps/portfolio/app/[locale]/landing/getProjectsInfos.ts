
import Style from "./(elements)/ProjectScroll.module.scss";

const ProjectsInfos = [
	{
		background: Style.Intro,
		height: "100vh",
		url: '/landing',
		scrollTriggerId: "intro_scroll_trigger"
	},
	{
		background: Style.ProjectUVCH,
		height: "200vh",
		url: '/landing/projects/unreal-vscode-helper',
		scrollTriggerId: "uvch_scroll_trigger"
	},
	{
		background: Style.ProjectHugoMeet,
		height: "200vh",
		url: '/landing/projects/hugomeet',
		scrollTriggerId: "hugomeet_scroll_trigger"
	},
	{
		background: Style.ProjectProceduralTerrain,
		height: "300vh",
		url: '/landing/projects/procedural-terrain',
		scrollTriggerId: "procedural_terrain_scroll_trigger"
	}
];

export default ProjectsInfos;