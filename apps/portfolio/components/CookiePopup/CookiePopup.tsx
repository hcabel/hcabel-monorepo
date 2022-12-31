import Image from "next/image";

// Design
import Style from "./CookiePopup.module.scss";
import CookiesBackground from "Images/CookiesBackground.png";
import Link from "next/link";

interface ICookiePopupProps {
	onAccept: () => void,
	onDeny: () => void
}

export default function CookiePopup(props: ICookiePopupProps)
{
	return (
		<div className={Style.Popup}>
			<Image
				src={CookiesBackground}
				alt="Coookies popup background"
				className={Style.BackgroundImage} />
			<h4 className={`h4 ${Style.Title}`}>🍪Cookie Policy🍪</h4>
			<div className={Style.Grid2x2}>
				<ul>
					<li><b>{"Custom made"}</b>{",\n stored in my own database"}</li>
					<li><b>{"Anonymous"}</b>{",\n I couldn't identify you even if I wanted"}</li>
				</ul>
				<ul>
					<li><b>{"Not selled to anyone"}</b>{",\n I dont know how to do so anyway"}</li>
					<li><b>{"Privacy safe"}</b>{",\n very little data are collected"}</li>
				</ul>
			</div>
			<h5 className={`${Style.Title} ${Style.GoToSource} h5`}>
				{"If you dont believe me => "}
				<Link href="https://github.com/hcabel/hcabel-monorepo">
					source code
				</Link>
			</h5>
			<div className={Style.Buttons}>
				<button onClick={props.onDeny}>
					<h5 className={`h5 ${Style.BtnText}`}>Deny 😞</h5>
				</button>
				<button onClick={props.onAccept} className={`${Style.PrimaryBtn}`}>
					<h5 className={`h5 ${Style.BtnText}`}>Allow 😊</h5>
				</button>
			</div>
		</div>
	);
}