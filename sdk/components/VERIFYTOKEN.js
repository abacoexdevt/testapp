import cookies from 'js-cookie';
import axios from 'axios';

import ENV from '../environment';
import { apiUrl, cookieConfig } from '../config';

export default async ({
	environment = cookies.get('environment') ? cookies.get('environment') : ENV.PRODUCTION,
	token = cookies.get('token') ? cookies.get('token') : '',
	url = null
} = {}) => {
	try {
		if (!token) throw new Error('No token provided');
		if (!environment) throw new Error('No environment set');

		url = url ? `${url}api/verifyToken` : `${apiUrl[environment]}api/verifyToken`;

		const { data } = await axios.get(url, {
			headers: { Authorization: token }
		});

		cookies.set('token', data.newToken, cookieConfig);
		return data;
	} catch (error) {
		if (error.response) throw new Error(error.response.data);
		if (error.message) throw new Error(error.message);
		throw new Error(error);
	}
};
