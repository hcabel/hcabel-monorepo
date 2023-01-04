
import Style from "./ServicesCard.module.scss";

interface IServicesCardProps {
	className?: string;
	icon?: React.ReactNode;
	title: string;
	description: string | React.ReactNode;
}

export default function ServicesCard(props: IServicesCardProps)
{
	return (
		<div className={`${Style.Card} ${props.className || ''}`}>
			<div className={Style.CardInner}>
				<h3 className={Style.CardTitle}>{props.title}</h3>
				<p dangerouslySetInnerHTML={{ __html: (typeof props.description === "string" ? props.description : `${props.description}`) }} />
			</div>
			{props.icon && <div className={Style.Icon}>{props.icon}</div>}
		</div>
	);
}