'use client';

import { useEffect } from 'react';

interface LocaleLayoutProps {
	children: React.ReactNode;
	params: {
		locale: string;
	};
}

export default function LocaleLayout(props: LocaleLayoutProps)
{
	useEffect(() => {
		document.documentElement.lang = props.params.locale || "en";
	}, [props.params.locale]);

	return (props.children);
}
