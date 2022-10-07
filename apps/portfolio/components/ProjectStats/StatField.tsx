import Link from 'next/link';
import Style from 'Styles/components/ProjectStats.module.scss';

export interface IStatField {
	name: string;
	value: number;
	url: string;
	icon?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

export default function StatField(props: IStatField)
{
	return (
		<Link href={props.url}>
			<a className={Style.StatField}>
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
		</Link>
	);
}