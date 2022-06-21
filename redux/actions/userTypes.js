import { database } from '../../sdk';
import actions from './actionTypes';
const { USERTYPE } = actions;

export const fetch = payload => async dispatch => {
	const { all = false, filter = {}, id = null, page = 1, redux = true, size = 20, sortBy = {} } = payload;

	try {
		if (redux) dispatch({ type: USERTYPE.FETCH.REQUEST });
		let request = database.get({ entity: 'UserType' }).page(page).size(size);
		if (all) request = request.all();
		if (filter) request = request.filter(filter);
		if (id) request = request.autoPopulate(false).setId(id);
		if (sortBy) request = request.sort(sortBy);
		const response = await request.exec();

		if (redux)
			dispatch({
				type: USERTYPE.FETCH.SUCCESS,
				payload: { ...response, end: all ? true : response.end, id }
			});
		return response;
	} catch (error) {
		if (redux) dispatch({ type: USERTYPE.FETCH.FAILURE, payload: error.message });
		throw new error(error.message);
	}
};

export const create = payload => {
	return async dispatch => {
		try {
			dispatch({ type: USERTYPE.CREATE.REQUEST });
			const response = await database.create({ entity: 'UserType' }).data(payload).exec();
			dispatch({ type: USERTYPE.CREATE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			console.log(error);
			dispatch({ type: USERTYPE.CREATE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const update = payload => {
	return async dispatch => {
		try {
			dispatch({ type: USERTYPE.UPDATE.REQUEST });
			const response = await database.update({ entity: 'UserType', id: payload.Id }).data(payload).exec();
			dispatch({ type: USERTYPE.UPDATE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			dispatch({ type: USERTYPE.UPDATE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const deleted = id => {
	return async dispatch => {
		try {
			dispatch({ type: USERTYPE.DELETE.REQUEST });
			const response = await database.delete({ entity: 'UserType', id }).exec();
			console.log('response', response);
			dispatch({ type: USERTYPE.DELETE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			console.log(error);
			dispatch({ type: USERTYPE.DELETE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const setForm = (payload = null) => ({ type: USERTYPE.SETFORM, payload });
export const toggle = (payload = true) => ({ type: USERTYPE.MODAL, payload });
