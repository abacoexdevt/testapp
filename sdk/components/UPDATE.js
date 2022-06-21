import cookies from 'js-cookie';
import param from 'jquery-param';
import FormData from 'form-data';
import axios from 'axios';

import ENV from '../environment';
import { apiUrl } from '../config';

export default class PUT {
	constructor(
		entity = null,
		id = null,
		token = cookies.get('token') ? cookies.get('token') : cookies.get('tempToken'),
		environment = cookies.get('environment') ? cookies.get('environment') : ENV.PRODUCTION,
		url = null
	) {
		this.body = {};
		this.entity = entity;
		this.environment = environment;
		this.id = id;
		this.params = { autoPopulate: true };
		this.token = token;
		this.url = url;
	}

	autoPopulate = (isPopulate = true) => {
		this.params = { ...this.params, autoPopulate: isPopulate };
		return this;
	};

	data = (data = {}) => {
		this.body = { ...data };
		return this;
	};

	populate = (fields = []) => {
		this.params = { ...this.params, populate: fields };
		return this;
	};

	exec = async () => {
		try {
			const form = new FormData();
			Object.keys(this.body).map(key => {
				if (Array.isArray(this.body[key])) {
					const hasFile = this.body[key].find(d => d instanceof File || (d.name && d.type));
					this.body[key].map(d =>
						form.append(key, hasFile ? (d instanceof File ? d : JSON.stringify(d)) : d)
					);
				} else {
					form.append(
						key,
						typeof this.body[key] !== 'boolean' ? this.body[key] : JSON.stringify(this.body[key])
					);
				}
			});

			const url = this.url
				? `${this.url}api/e/${this.entity}/${this.id}?${param(this.params)}`
				: `${apiUrl[this.environment]}api/e/${this.entity}/${this.id}?${param(this.params)}`;
			const headers = form.getHeaders ? { ...form.getHeaders() } : {};
			const { data } = await axios.put(url, form, {
				headers: { ...headers, Authorization: this.token }
			});

			return data;
		} catch (error) {
			if (error.response) throw new Error(error.response.data);
			if (error.message) throw new Error(error.message);
			throw new Error(error);
		}
	};
}
