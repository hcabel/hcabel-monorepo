
export default function Head() {
	return (
		<>
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
			<link rel="manifest" href="/site.webmanifest" />

			{/* HTML Meta Tags */}
			<title>Hugo Cabel</title>
			<meta name="description" content="My portfolio, come see my personal projects and what I'm capable of." />
			<meta content="width=device-width, initial-scale=1" name="viewport" />
			<meta name="theme-color" content="#ffffff" />

			{/* Facebook Meta Tags */}
			<meta property="og:url" content="https://hugocabel.com" />
			<meta property="og:type" content="website" />
			<meta property="og:title" content="Hugo Cabel" />
			<meta property="og:description" content="My portfolio, come see my personal projects and what I'm capable of." />
			<meta property="og:image" content="https://hugocabel.com/android-chrome-512x512.png" />

			{/* Twitter Meta Tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta property="twitter:domain" content="hugocabel.com" />
			<meta property="twitter:url" content="https://hugocabel.com" />
			<meta name="twitter:title" content="Hugo Cabel" />
			<meta name="twitter:description" content="My portfolio, come see my personal projects and what I'm capable of." />
			<meta name="twitter:image" content="https://hugocabel.com/android-chrome-512x512.png" />
		</>
	);
}
