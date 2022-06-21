import axios from 'axios';
import Cookies from 'cookies';

import ENV from '../environment';
import { apiUrl, cookieConfig } from '../config';

export default async ({
	apiKey: apiKeyInitial,
	captchToken = '',
	emailAddress = '',
	environment: environmentInitial,
	eu: euInitial,
	headers = {},
	password = '',
	rememberMe = false,
	res,
	req,
	url = null
} = {}) => {
	try {
		const cookies = req && res ? new Cookies(req, res) : require('js-cookie');

		// const apiKey = apiKeyInitial ? apiKeyInitial : cookies.get('apiKey') ? cookies.get('apiKey') : '';
		const environment = environmentInitial
			? environmentInitial
			: cookies.get('environment')
			? cookies.get('environment')
			: ENV.PRODUCTION;

		// if (!apiKey) throw new Error('No API Key set');
		if (!environment) throw new Error('No environment set');

		url = url ? `${url}api/auth/email` : `${apiUrl[environment]}api/auth/email`;

		const form = { captchToken, emailAddress, password, rememberMe };
		const { data } = await axios.post(url, form, {
			headers: headers ? headers : {}
		});

		cookies.set('account', data.account, cookieConfig);
		cookies.set('token', data.token, cookieConfig);
		cookies.set('refreshToken', data.refreshToken, cookieConfig);

		return data;
	} catch (error) {
		if (error.response) throw new Error(error.response.data);
		if (error.message) throw new Error(error.message);
		throw new Error(error);
	}
};
