import { database } from '../../sdk';
import actions from './actionTypes';
const { CUSTOMERS } = actions;

export const fetch = payload => async dispatch => {
	const { all = false, filter = {}, id = null, page = 1, redux = true, size = 20, sortBy = {} } = payload;

	try {
		if (redux) dispatch({ type: CUSTOMERS.FETCH.REQUEST });
		let request = database.get({ entity: 'Customers' }).page(page).size(size);
		if (all) request = request.all();
		if (filter) request = request.filter(filter);
		if (id) request = request.autoPopulate(false).setId(id);
		if (sortBy) request = request.sort(sortBy);
		const response = await request.exec();

		if (redux)
			dispatch({
				type: CUSTOMERS.FETCH.SUCCESS,
				payload: { ...response, end: all ? true : response.end, id }
			});
		return response;
	} catch (error) {
		console.log(error);
		if (redux) dispatch({ type: CUSTOMERS.FETCH.FAILURE, payload: error.message });
		throw new error(error.message);
	}
};

export const create = payload => {
	return async dispatch => {
		try {
			dispatch({ type: CUSTOMERS.CREATE.REQUEST });
			const response = await database.create({ entity: 'Customers' }).data(payload).exec();
			dispatch({ type: CUSTOMERS.CREATE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			console.log(error);
			dispatch({ type: CUSTOMERS.CREATE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const update = payload => {
	return async dispatch => {
		try {
			dispatch({ type: CUSTOMERS.UPDATE.REQUEST });
			const response = await database.update({ entity: 'Customers', id: payload.Id }).data(payload).exec();
			dispatch({ type: CUSTOMERS.UPDATE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			dispatch({ type: CUSTOMERS.UPDATE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const deleted = id => {
	return async dispatch => {
		try {
			dispatch({ type: CUSTOMERS.DELETE.REQUEST });
			const response = await database.delete({ entity: 'Customers', id }).exec();
			console.log('response', response);
			dispatch({ type: CUSTOMERS.DELETE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			console.log(error);
			dispatch({ type: CUSTOMERS.DELETE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const setForm = (payload = null) => ({ type: CUSTOMERS.SETFORM, payload });
export const toggle = (payload = true) => ({ type: CUSTOMERS.MODAL, payload });
