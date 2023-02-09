import { Locales } from "App/[locale]/LocaleContext";

export type I18nDictValue = { [locale in Locales]: string };
export type I18nDict = { [locale: string]: I18nDictValue };

/**
 * Fetch translated text from the i18nDict.json file.
 * The text is fetch using the key and the locale provided.
 * @param key the key to fetch the text from the i18nDict.json file
 * @param locale the locale to fetch the text from the i18nDict.json file
 * @returns the translated text in the locale provided
 */
export function GetI18nDictValue(key: string, locale: Locales): string {
	const value = (i18nDict as any)[key]?.[locale] || null;
	if (value === null) {
		throw new Error(`i18n key "${key}" not found in locale "${locale}"`);
	}
	return value;
}

export const i18nDict: I18nDict = {
	MyJob: {
		en: "Software Engineer",
		fr: "Ingénieur logiciel",
	},
	"MyProjects-Title": {
		en: "My projects",
		fr: "Mes projets",
	},
	MoreDetails: {
		en: "More details",
		fr: "Plus de détails",
	},
	"Go to HugoMeet": {
		en: "Go to HugoMeet",
		fr: "Aller sur HugoMeet",
	},
	"What I do": {
		en: "What I do",
		fr: "Ce que je fais",
	},
	"Unreal Engine Tools Programmer": {
		en: "Unreal Engine Tools Programmer",
		fr: "Programmeur d'outils Unreal Engine",
	},
	"Unreal Engine Tools Programmer - Description": {
		en: "As a tools programmer, I can create <b>custom plugins for Unreal Engine</b> that run within the editor environment.<br /> These plugins can help <b>streamline workflows</b> and <b>improve efficiency</b> for teams working on projects in Unreal Engine.",
		fr: "En tant que programmeur d'outils, je peux créer des <b>plugins personnalisés pour Unreal Engine</b> qui s'exécutent dans l'environnement de l'éditeur.<br /> Ces plugins peuvent aider à <b>fluidifier les workflows</b> et à <b>améliorer l'efficacité</b> des équipes travaillant sur des projets dans Unreal Engine.",
	},
	"Unreal Engine Gameplay Programmer": {
		en: "Unreal Engine Gameplay Programmer",
		fr: "Programmeur de gameplay Unreal Engine",
	},
	"Unreal Engine Gameplay Programmer - Description": {
		en: "As a gameplay programmer with extensive experience in Unreal Engine.<br /> I have the skills and knowledge to <b>develop custom runtime gameplay</b> systems that enhance the player experience.<br /> My expertise in the Unreal Engine API and proficiency in C++ allows me to create tailored solutions that meet the specific needs of my clients.<br />",
		fr: "En tant que programmeur de gameplay avec une expérience étendue dans Unreal Engine.<br /> J'ai les compétences et la connaissance pour <b>développer des systèmes de gameplay d'exécution personnalisés</b> qui améliorent l'expérience du joueur.<br /> Mon expertise dans l'API Unreal Engine et ma maîtrise du C++ me permettent de créer des solutions sur mesure répondant aux besoins spécifiques de mes clients.<br />",
	},
	"Front-End Design Implementation": {
		en: "Front-End Design Implementation",
		fr: "Front-End Implémentation de design",
	},
	"Front-End Design Implementation - Description": {
		en: "As a front-end developer, I have the skills and experience to <b>implement mockups of design in existing websites</b>.<br /> My expertise extends to a wide range of web technologies, including Next.js, React.js, HTML, CSS, SCSS and more.<br />",
		fr: "En tant que développeur front-end, j'ai les compétences et l'expérience pour <b>implémenter des maquettes de design dans des sites Web existants</b>.<br /> Mon expertise s'étend à une large gamme de technologies Web, notamment Next.js, React.js, HTML, CSS, SCSS et plus encore.<br />",
	},
	"Backend Development": {
		en: "Back-End Development",
		fr: "Développement Back-End",
	},
	"Backend Development - Description": {
		en: "As a backend developer with skills and experience in <b>creating custom REST APIs</b>, I can enable data exchange between systems and applications.<br /> My expertise allows me to develop APIs that are  <b>scalable, reliable, and secure</b>.<br /> With the posibility of <b>real-time data exchange</b>, using technologies such as <b>WebSockets</b>.<br />",
		fr: "En tant que développeur back-end avec des compétences et une expérience dans la <b>création d'API REST personnalisées</b>, je peux permettre l'échange de données entre les systèmes et les applications.<br /> Mon expertise me permet de développer des API <b>évolutives, fiables et sécurisées</b>.<br /> Avec la possibilité d'<b>échange de données en temps réel</b>, en utilisant des technologies telles que <b>WebSockets</b>.<br />",
	},
	"WebRTC Development": {
		en: "WebRTC Development",
		fr: "Développement WebRTC",
	},
	"WebRTC Development - Description": {
		en: "As a skilled WebRTC developer, I have the expertise to <b>quickly create prototypes</b> for real-time communication applications.<br /> My experience in implementing WebRTC and setting up <b>STUN and TURN servers</b> allows me to rapidly develop functional prototypes.<br /> Whether you need to test out a new <b>video conferencing</b> feature, a <b>real-time chat</b> system, or another type of <b>real-time communication</b>, I can help you create a <b>working prototype</b> in a short amount of time.<br />",
		fr: "En tant que développeur WebRTC expérimenté, j'ai l'expertise pour <b>créer rapidement des prototypes</b> pour des applications de communication en temps réel.<br /> Mon expérience dans l'implémentation de WebRTC et la mise en place de <b>serveurs STUN et TURN</b> me permet de développer rapidement des prototypes fonctionnels.<br /> Que vous ayez besoin de tester une nouvelle fonctionnalité de <b>vidéoconférence</b>, un <b>système de chat en temps réel</b> ou un autre type de <b>communication en temps réel</b>, je peux vous aider à créer un <b>prototype fonctionnel</b> en un temps très court.<br />",
	},
	"Let's Collaborate and Brainstorm!": {
		en: "Let's Collaborate and Brainstorm!",
		fr: "Travaillons et brainstormons ensemble!",
	},
	"Let's Collaborate and Brainstorm! - Description": {
		en: "I'm always looking for <b>new challenges and opportunities</b> to collaborate with clients and help bring their ideas to life.<br /> Whether you have a <b>clear vision</b> for your project <b>or</b> you're <b>still brainstorming</b> and looking for guidance, I'm here to listen and help you shape your ideas into a plan of action.<br /> Let's work together to turn your vision into a reality.<br />",
		fr: "Je suis toujours à la recherche de <b>nouveaux défis et opportunités</b> pour collaborer avec des clients et aider à concrétiser leurs idées.<br /> Que vous ayez une <b>vision claire</b> de votre projet <b>ou</b> que vous soyez <b>encore en train de brainstormer</b> et à la recherche d'orientation, je suis là pour écouter et vous aider à façonner vos idées en un plan d'action.<br /> Travaillons ensemble pour transformer votre vision en réalité.<br />",
	},
	"Go to my Malt profile": {
		en: "Go to my Malt profile",
		fr: "Vers mon profil Malt",
	},
	"Go to my LinkeIn profile": {
		en: "Go to my LinkeIn profile",
		fr: "Vers mon profil LinkeIn",
	},
};
