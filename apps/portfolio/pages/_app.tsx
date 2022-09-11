import { AppProps } from 'next/app';
import Head from 'next/head';

function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>HugoCabel.com</title>
			</Head>
			<main>
				<Component {...pageProps} />
			</main>
		</>
	);
}

export default App;
