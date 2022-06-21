import { database } from '../../sdk';
import actions from './actionTypes';
const { CASES } = actions;
const entity = 'Case';

export const fetch = payload => async dispatch => {
	const { all = false, filter = {}, id = null, page = 1, redux = true, size = 20, sortBy = {} } = payload;

	try {
		if (redux) dispatch({ type: CASES.FETCH.REQUEST });
		let request = database.get({ entity }).page(page).size(size);
		if (all) request = request.all();
		if (filter) request = request.filter(filter);
		if (id) request = request.autoPopulate(false).setId(id);
		if (sortBy) request = request.sort(sortBy);
		const response = await request.exec();

		if (redux)
			dispatch({
				type: CASES.FETCH.SUCCESS,
				payload: { ...response, end: all ? true : response.end, id }
			});
		return response;
	} catch (error) {
		console.log(error);
		if (redux) dispatch({ type: CASES.FETCH.FAILURE, payload: error.message });
		throw new error(error.message);
	}
};

export const create = payload => {
	return async dispatch => {
		try {
			dispatch({ type: CASES.CREATE.REQUEST });
			const response = await database.create({ entity }).data(payload).exec();
			dispatch({ type: CASES.CREATE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			console.log(error);
			dispatch({ type: CASES.CREATE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const update = payload => {
	return async dispatch => {
		try {
			dispatch({ type: CASES.UPDATE.REQUEST });
			const response = await database.update({ entity, id: payload.Id }).data(payload).exec();
			console.log('response', response);
			dispatch({ type: CASES.UPDATE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			dispatch({ type: CASES.UPDATE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const deleted = id => {
	return async dispatch => {
		try {
			dispatch({ type: CASES.DELETE.REQUEST });
			const response = await database.delete({ entity, id }).exec();
			console.log('response', response);
			dispatch({ type: CASES.DELETE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			console.log(error);
			dispatch({ type: CASES.DELETE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const setForm = (payload = null) => ({ type: CASES.SETFORM, payload });
export const toggle = (payload = true) => ({ type: CASES.MODAL, payload });
