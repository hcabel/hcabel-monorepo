import Style from 'Styles/components/ProjectStats.module.scss';

export interface IStatField {
	name: string;
	value: number;
	url?: string;
	icon?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

export default function StatField(props: IStatField)
{
	return (
		<a className={Style.StatField} href={props.url}>
			{props.icon &&
				<div className={Style.StatIcon}>
					{props.icon}
				</div>
			}
			<span className={Style.StatValue}>
				{props.value.toLocaleString("en", {notation: "compact"})}
			</span>
			<span className={Style.StatName}>
				{props.name}
			</span>
		</a>
	);
}