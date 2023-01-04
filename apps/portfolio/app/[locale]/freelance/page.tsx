import Link from "next/link";

import Style from "./page.module.scss";

import OrangeWaveUpsideDown from "Images/OrangeWaveUpsideDown.svg";
import Arrow from "Images/arrow.svg";
import BoxScroller from "Components/BoxScroller/BoxScroller";
import ServicesCard from "./(elements)/ServicesCard";

import Tools from "Images/Tools.svg";
import Server from "Images/Server.svg";
import Handshake from "Images/Handshake.svg";
import Camera from "Images/Camera.svg";
import Monitor from "Images/Monitor.svg";
import Controller from "Images/Controller.svg";
import LightPurplePeaksStacked from "Images/LightPurplePeaksStacked.svg";
import Malt from "Images/Malt.svg";
import Linkedin from "Images/Linkedin.svg";

export default async function freelance({ params: { locale } }: any)
{
	return (
		<main className={`Page ${Style.FreelancePage}`}>
			<Link className={Style.BackArrow} href={`/${locale}`}>
				<Arrow />
			</Link>
			<header>
				<div className={Style.FirstSection}>
					<h1 className={Style.Title}>Freelance</h1>
				</div>
				<OrangeWaveUpsideDown />
			</header>
			<section className={Style.WhatIdo}>
				<h2>What I do :</h2>
				<BoxScroller useSnap entryClassName={Style.CardsEntry}>
					<ServicesCard
						title="Unreal Engine Tools Programmer"
						description={
							<p>
								As a tools programmer, I can create <b>custom plugins for Unreal Engine</b> that run within the editor environment.<br />
								These plugins can help <b>streamline workflows</b> and <b>improve efficiency</b> for teams working on projects in Unreal Engine.<br />
							</p>
						}
						icon={<Tools />}
					/>
					<ServicesCard
						title="Unreal Engine Gameplay Programmer"
						description={
							<p>
								As a gameplay programmer with extensive experience in Unreal Engine.<br />
								I have the skills and knowledge to <b>develop custom runtime gameplay</b> systems that enhance the player experience.<br />
								My expertise in the Unreal Engine API and proficiency in C++ allows me to create tailored solutions that meet the specific needs of my clients.<br />
							</p>
						}
						icon={<Controller />}
					/>
					<ServicesCard
						title="Front-End Design Implementation"
						description={
							<p>
								As a front-end developer, I have the skills and experience to <b>implement mockups of design in existing websites</b>.<br />
								My expertise extends to a wide range of web technologies, including Next.js, React.js, HTML, CSS, SCSS and more.<br />
							</p>
						}
						icon={<Monitor />}
					/>
					<ServicesCard
						title="Backend Development"
						description={
							<p>
								As a backend developer with skills and experience in <b>creating custom REST APIs</b>, I can enable data exchange between systems and applications.<br />
								My expertise allows me to develop APIs that are  <b>scalable, reliable, and secure</b>.<br />
								With the posibility of <b>real-time data exchange</b>, using technologies such as <b>WebSockets</b>.<br />
							</p>
						}
						icon={<Server />}
					/>
					<ServicesCard
						title="WebRTC Development"
						description={
							<p>
								As a skilled WebRTC developer, I have the expertise to <b>quickly create prototypes</b> for real-time communication applications.<br />
								My experience in implementing WebRTC and setting up <b>STUN and TURN servers</b> allows me to rapidly develop functional prototypes.<br />
								Whether you need to test out a new <b>video conferencing</b> feature, a <b>real-time chat</b> system, or another type of <b>real-time communication</b>, I can help you create a <b>working prototype</b> in a short amount of time.<br />
							</p>
						}
						icon={<Camera />}
					/>
					<ServicesCard
						className={Style.CollaborateCard}
						title="Let's Collaborate and Brainstorm!"
						description={
							<p>
								I'm always looking for <b>new challenges and opportunities</b> to collaborate with clients and help bring their ideas to life.<br />
								Whether you have a <b>clear vision</b> for your project <b>or</b> you're <b>still brainstorming</b> and looking for guidance, I'm here to listen and help you shape your ideas into a plan of action.<br />
								Let's work together to turn your vision into a reality.<br />
							</p>
						}
						icon={<Handshake />}
					/>
				</BoxScroller>
			</section>
			<section className={Style.ContactMe}>
				<LightPurplePeaksStacked />
				<div className={Style.SectionInner}>
					<h2>Contact me :</h2>
					<div className={Style.Platforms}>
						<a /* href="https://www.malt.fr/profile/hugocabel"*/>
							<Malt />
						</a>
						<a /* href="https://www.linkedin.com/in/hugo-cabel-553701202/"*/>
							<Linkedin />
						</a>
					</div>
					<h4 className={`h4 ${Style.Email}`}>freelance@hugocabel.com</h4>
				</div>
			</section>
		</main>
	)
}