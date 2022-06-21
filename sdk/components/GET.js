import cookies from 'js-cookie';
import param from 'jquery-param';
import axios from 'axios';

import ENV from '../environment';
import { apiUrl } from '../config';

const CancelToken = axios.CancelToken;

export default class GET {
	constructor(
		entity = null,
		token = cookies.get('token') ? cookies.get('token') : cookies.get('tempToken'),
		environment = cookies.get('environment') ? cookies.get('environment') : ENV.PRODUCTION,
		post = false,
		url = null
	) {
		this.entity = entity;
		this.environment = environment;
		this.id = null;
		this.token = token;
		this.post = post;
		this.url = url;

		this.axiosSource = CancelToken.source();
		this.cancel = this.axiosSource.cancel;

		this.params = {
			limit: 50,
			page: 1,
			sortBy: { DateCreated: -1 }
		};
	}

	access = (account = null) => {
		this.params = account ? { ...this.params, access: true, account } : { ...this.params, access: true };
		return this;
	};

	all = () => {
		this.params = { ...this.params, all: true };
		return this;
	};

	autoPopulate = (isPopulate = true) => {
		this.params = { ...this.params, autoPopulate: isPopulate };
		return this;
	};

	cache = (key = '', expiration = null) => {
		this.params = { ...this.params, cache: { key, expiration } };
		return this;
	};

	count = () => {
		this.params = { ...this.params, count: true };
		return this;
	};

	fields = (fields = []) => {
		this.params = { ...this.params, fields: [...fields] };
		return this;
	};

	filter = (filter = {}) => {
		this.params = { ...this.params, filter: { ...filter } };
		return this;
	};

	ids = (ids = []) => {
		this.params = { ...this.params, ids: [...ids] };
		return this;
	};

	keywords = (keywords = '') => {
		this.params = { ...this.params, keywords: keywords };
		return this;
	};

	offset = (offset = 0) => {
		this.params = { ...this.params, offset };
		return this;
	};

	page = (page = 1) => {
		this.params = { ...this.params, page };
		return this;
	};

	populate = (fields = []) => {
		this.params = { ...this.params, populate: fields };
		return this;
	};

	setId = (id = null) => {
		console.log('id', id);
		this.id = id;
		return this;
	};

	size = (limit = 1) => {
		this.params = { ...this.params, limit };
		return this;
	};

	sort = (sortBy = { DateCreated: -1 }) => {
		this.params = { ...this.params, sortBy };
		return this;
	};

	exec = async () => {
		try {
			let data = {};
			if (this.post) {
				const url = this.url
					? `${this.url}api/e/post/${this.entity}${this.id ? `/${this.id}` : ''}`
					: `${apiUrl[this.environment]}api/e/post/${this.entity}${this.id ? `/${this.id}` : ''}`;
				const { data: responseData } = await axios.post(url, this.params, {
					cancelToken: this.axiosSource.token,
					headers: {
						Authorization: this.token
					}
				});
				data = responseData;
			} else {
				const url = this.url
					? `${this.url}api/e/${this.entity}${this.id ? `/${this.id}` : ''}?${param(this.params)}`
					: `${apiUrl[this.environment]}api/e/${this.entity}${this.id ? `/${this.id}` : ''}?${param(
							this.params
					  )}`;
				const { data: responseData } = await axios.get(url, {
					cancelToken: this.axiosSource.token,
					headers: {
						Authorization: this.token
					}
				});
				data = responseData;
			}

			return data;
		} catch (error) {
			console.log(error);
			if (axios.isCancel(error)) throw new Error('Request canceled', error.message);
			if (error.response) throw new Error(error.response.data);
			if (error.message) throw new Error(error.message);
			throw new Error(error);
		}
	};
}
