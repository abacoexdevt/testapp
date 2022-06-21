import ErrorPage from 'next/error';

const Index = error => (error ? <ErrorPage statusCode={404} /> : null);

export async function getServerSideProps(context) {
	const { req, res, query } = context;
	const { apiUrl, environment } = require('../config');
	const Cookies = require('cookies');
	const cookies = new Cookies(req, res);

	try {
		const token = cookies.get('token');
		if (token) {
			const request = await fetch(`${apiUrl[environment]}api/verifyToken`, { headers: { Authorization: token } });
			if (request.ok) {
				const response = await request.json();
				if (response.application.Id === 'amlc') {
					if (query.redirect) {
						res.writeHead(302, { Location: `${query.redirect}/${token}` });
						res.end();
					} else {
						res.writeHead(302, { Location: '/home' });
						res.end();
					}
				}
			}
			return { props: { error: null } };
		}
		res.writeHead(302, { Location: '/login' });
		res.end();
		return { props: { error: null } };
	} catch (error) {
		return { props: { error: error.message } };
	}
}

export default Index;
