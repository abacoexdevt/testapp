import cookies from 'js-cookie';
import param from 'jquery-param';
import FormData from 'form-data';
import axios from 'axios';
import ENV from '../environment';
import { apiUrl } from '../config';

export default class POST {
	constructor(
		entity = null,
		token = cookies.get('token') ? cookies.get('token') : cookies.get('tempToken'),
		environment = cookies.get('environment') ? cookies.get('environment') : ENV.PRODUCTION,
		url = null
	) {
		this.body = {};
		this.entity = entity;
		this.environment = environment;
		this.params = {
			autoPopulate: true
		};
		this.token = token;
		this.url = url;
	}

	autoPopulate = (isPopulate = true) => {
		this.params = {
			...this.params,
			autoPopulate: isPopulate
		};
		return this;
	};

	data = (data = {}) => {
		this.body = {
			...data
		};
		return this;
	};

	populate = (fields = []) => {
		this.params = {
			...this.params,
			populate: fields
		};
		return this;
	};

	exec = async () => {
		try {
			const form = new FormData();
			Object.keys(this.body).map(key => {
				if (Array.isArray(this.body[key])) {
					this.body[key].map(d => form.append(key, d));
				} else {
					form.append(`${key}`, this.body[key]);
				}
			});
			const url = this.url
				? `${this.url}api/e/${this.entity}?${param(this.params)}`
				: `${apiUrl[this.environment]}api/e/${this.entity}?${param(this.params)}`;
			const headers = form.getHeaders
				? {
						...form.getHeaders()
				  }
				: {};

			const { data } = await axios.post(url, form, {
				headers: {
					...headers,
					'Content-Type': 'multipart/form-data',
					Authorization: this.token
				}
			});
			return data;
		} catch (error) {
			if (error.response) throw new Error(error.response.data);
			if (error.message) throw new Error(error.message);
			throw new Error(error);
		}
	};
}
