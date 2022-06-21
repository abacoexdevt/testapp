import { database } from '../../sdk';
import actions from './actionTypes';
const { USERS } = actions;

export const fetch = payload => async dispatch => {
	const { all = false, filter = {}, id = null, page = 1, redux = true, size = 20, sortBy = {} } = payload;

	try {
		if (redux) dispatch({ type: USERS.FETCH.REQUEST });
		let request = database.get({ entity: 'User' }).page(page).size(size);
		if (all) request = request.all();
		if (filter) request = request.filter(filter);
		if (id) request = request.autoPopulate(false).setId(id);
		if (sortBy) request = request.sort(sortBy);
		const response = await request.exec();

		if (redux)
			dispatch({
				type: USERS.FETCH.SUCCESS,
				payload: { ...response, end: all ? true : response.end, id }
			});
		return response;
	} catch (error) {
		if (redux) dispatch({ type: USERS.FETCH.FAILURE, payload: error.message });
		throw new error(error.message);
	}
};

export const create = payload => {
	return async dispatch => {
		try {
			dispatch({ type: USERS.CREATE.REQUEST });
			const response = await database.create({ entity: 'User' }).data(payload).exec();
			dispatch({ type: USERS.CREATE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			console.log(error);
			dispatch({ type: USERS.CREATE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const update = payload => {
	return async dispatch => {
		try {
			dispatch({ type: USERS.UPDATE.REQUEST });
			const response = await database.update({ entity: 'User', id: payload.Id }).data(payload).exec();
			dispatch({ type: USERS.UPDATE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			dispatch({ type: USERS.UPDATE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const deleted = id => {
	return async dispatch => {
		try {
			dispatch({ type: USERS.DELETE.REQUEST });
			const response = await database.delete({ entity: 'User', id }).exec();
			console.log('response', response);
			dispatch({ type: USERS.DELETE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			console.log(error);
			dispatch({ type: USERS.DELETE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const setForm = (payload = null) => ({ type: USERS.SETFORM, payload });
export const toggle = (payload = true) => ({ type: USERS.MODAL, payload });
