import Head from 'next/head';

const Meta = ({ title, keywords, description }) => {
	return (
		<Head>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="keywords" content={keywords} />
			<meta name="description" content={description} />
			<meta charSet="utf-8" />
			<link rel="icon" href="/coexstaricon.ico" />
			<title>{title} | AML Tool Coexstar PH</title>
		</Head>
	);
};

Meta.defaultProps = {
	title: 'AML Tool | Coexstar PH',
	keywords: 'AMLC',
	description: 'AMLC tool'
};

export default Meta;
