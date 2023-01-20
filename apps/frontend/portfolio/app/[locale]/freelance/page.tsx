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
import { GetI18nDictValue } from "Utils/i18nDict";
import { ILocaleLayoutProps } from "../layout";

export default async function freelance(props: ILocaleLayoutProps) {
	return (
		<main className={`Page ${Style.FreelancePage}`}>
			<Link
				className={Style.BackToLandingPageArrow}
				href={`/${props.params.locale}`}
				aria-label="Go back to the landing page"
			>
				<Arrow />
			</Link>
			<header>
				<div className={Style.FirstSection}>
					<h1 className={Style.Title}>Freelance</h1>
				</div>
				<OrangeWaveUpsideDown />
			</header>
			<section className={Style.WhatIdo}>
				<h2>{"What I do"} :</h2>
				<BoxScroller useSnap entryClassName={Style.CardsEntry}>
					<ServicesCard
						title={"Unreal Engine Tools Programmer"}
						description={GetI18nDictValue(
							"Unreal Engine Tools Programmer - Description",
							props.params.locale
						)}
						icon={<Tools />}
					/>
					<ServicesCard
						title={"Unreal Engine Gameplay Programmer"}
						description={GetI18nDictValue(
							"Unreal Engine Gameplay Programmer - Description",
							props.params.locale
						)}
						icon={<Controller />}
					/>
					<ServicesCard
						title={"Front-End Design Implementation"}
						description={GetI18nDictValue(
							"Front-End Design Implementation - Description",
							props.params.locale
						)}
						icon={<Monitor />}
					/>
					<ServicesCard
						title={"Backend Development"}
						description={GetI18nDictValue(
							"Backend Development - Description",
							props.params.locale
						)}
						icon={<Server />}
					/>
					<ServicesCard
						title={"WebRTC Development"}
						description={GetI18nDictValue(
							"WebRTC Development - Description",
							props.params.locale
						)}
						icon={<Camera />}
					/>
					<ServicesCard
						className={Style.CollaborateCard}
						title={"Let's Collaborate and Brainstorm!"}
						description={GetI18nDictValue(
							"Let's Collaborate and Brainstorm! - Description",
							props.params.locale
						)}
						icon={<Handshake />}
					/>
				</BoxScroller>
			</section>
			<section className={Style.ContactMe}>
				<LightPurplePeaksStacked />
				<div className={Style.SectionInner}>
					<div className={Style.Platforms}>
						<a
							href="https://www.malt.fr/profile/hugocabel"
							aria-label={GetI18nDictValue(
								"Go to my Malt profile",
								props.params.locale
							)}
						>
							<Malt />
						</a>
						<a
							href="https://www.linkedin.com/in/hugo-cabel-553701202/"
							aria-label={GetI18nDictValue(
								"Go to my LinkeIn profile",
								props.params.locale
							)}
						>
							<Linkedin />
						</a>
					</div>
					<h3 className={`h3 ${Style.Email}`}>
						freelance@hugocabel.com
					</h3>
				</div>
			</section>
		</main>
	);
}
