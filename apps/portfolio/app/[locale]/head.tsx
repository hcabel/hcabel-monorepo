
interface IHeadProps {
	title: string,
	desc: string
}

export default function Head(props: IHeadProps) {
	const title = props.title;
	const desc = props.desc?.replace(/\s+/g, ' ') || "";

	return (
		<>
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
			<link rel="manifest" href="/site.webmanifest" />

			{/* HTML Meta Tags */}
			<title>{title}</title>
			<meta name="description" content={desc} />
			<meta content="width=device-width, initial-scale=1" name="viewport" />
			<meta name="theme-color" content="#ffffff" />

			{/* Facebook Meta Tags */}
			<meta property="og:url" content="https://hugocabel.com" />
			<meta property="og:type" content="website" />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={desc} />
			<meta property="og:image" content="https://hugocabel.com/android-chrome-512x512.png" />

			{/* Twitter Meta Tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta property="twitter:domain" content="hugocabel.com" />
			<meta property="twitter:url" content="https://hugocabel.com" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={desc} />
			<meta name="twitter:image" content="https://hugocabel.com/android-chrome-512x512.png" />
		</>
	);
}
