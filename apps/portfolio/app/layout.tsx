import Head from "./head";

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children, }: RootLayoutProps) {
	return (
		<html>
			<Head />
			<body>{children}</body>
		</html>
	);
}
