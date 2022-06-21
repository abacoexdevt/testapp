import cookies from 'js-cookie';
import param from 'jquery-param';
import FormData from 'form-data';
import axios from 'axios';
import ENV from '../environment';
import { apiUrl } from '../config';

export default class DELETE {
	constructor(
		entity = null,
		id = null,
		token = cookies.get('token') ? cookies.get('token') : cookies.get('tempToken'),
		environment = cookies.get('environment') ? cookies.get('environment') : ENV.PRODUCTION,
		url = null
	) {
		this.body = {};
		this.entity = entity;
		this.id = id;
		this.environment = environment;
		this.params = {
			autoPopulate: true
		};
		this.token = token;
		this.url = url;
	}

	exec = async () => {
		try {
			const url = this.url
				? `${this.url}api/e/${this.entity}/${this.id}`
				: `${apiUrl[this.environment]}api/e/${this.entity}/${this.id}`;
			const { data } = await axios.delete(url, {
				headers: { Authorization: this.token }
			});

			return data;
		} catch (error) {
			if (error.response) throw new Error(error.response.data);
			if (error.message) throw new Error(error.message);
			throw new Error(error);
		}
	};
}
