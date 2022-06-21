const Logout = props => {
	console.log(props);
	return null;
};

export async function getServerSideProps(context) {
	const { res, req, query } = context;
	const Cookies = require('cookies');

	const cookies = new Cookies(req, res);
	cookies.set('token', null, { sameSite: 'lax' });

	const logOutUrl = cookies.get('logOutUrl');
	res.writeHead(302, { Location: logOutUrl ? logOutUrl : '/' });
	res.end();
	return { props: {} };
}

export default Logout;
