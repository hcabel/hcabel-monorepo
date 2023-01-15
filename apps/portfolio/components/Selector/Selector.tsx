"use client";

import { useState } from "react";

import Style from "./Selector.module.scss";

interface ISelectorProps {
	children: React.ReactNode[];
	renderSelected?: (selected: React.ReactNode) => React.ReactNode;
	firstHasDefault?: boolean;
	className?: string;
}

export default function Selector(props: ISelectorProps)
{
	const [_Selected, set_Selected] = useState<React.ReactNode>(props.firstHasDefault ? props.children[0] : null);
	const [_IsOpen, set_IsOpen] = useState<boolean>(false);

	function Open()
	{
		document.getElementById("Selector-Div").classList.add(Style.Open);

		set_IsOpen(true);

		// I have to delay the event registration otherwise it will call the event immediately
		setTimeout(() => {
			// close when clicking outside the selector
			document.addEventListener("click", Close);
			// close when leaving the window
			window.addEventListener("blur", Close);
			// close when pressing escape
			document.addEventListener("keydown", (e) => {
				if (e.key === "Escape") {
					Close();
				}
			});
		}, 40);
	}

	function Close()
	{
		document.getElementById("Selector-Div").classList.remove(Style.Open);

		set_IsOpen(false);

		document.removeEventListener("click", Close);
		window.removeEventListener("blur", Close);
		document.removeEventListener("keydown", Close);
	}

	function Toggle()
	{
		if (_IsOpen === true) {
			Close();
		}
		else {
			Open();
		}
	}

	function Select(child: React.ReactNode)
	{
		set_Selected(child);
		Close();
	}

	return (
		<div id="Selector-Div" className={`${Style.Selector} ${props.className}`}>
			<div className={Style.Selected} onClick={() => Toggle()}>
				{props.renderSelected(_Selected)}
			</div>
			<ul className={`${Style.Dropdown} ${_IsOpen ? Style.Open : ''}`}>
				{props.children.map((child, index) => {
					// Render all child in a li element
					return (
						<li key={index} onClick={() => Select(child)}>
							{child}
						</li>
					);
				})}
			</ul>
		</div>
	);
}