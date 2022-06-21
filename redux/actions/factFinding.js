import { database } from '../../sdk';
import actions from './actionTypes';
const { FACT } = actions;
const entity = 'Fact';

export const fetch = payload => async dispatch => {
	const { all = false, filter = {}, id = null, page = 1, redux = true, size = 20, sortBy = {} } = payload;

	try {
		if (redux) dispatch({ type: FACT.FETCH.REQUEST });
		let request = database.get({ entity }).page(page).size(size);
		if (all) request = request.all();
		if (filter) request = request.filter(filter);
		if (id) request = request.autoPopulate(false).setId(id);
		if (sortBy) request = request.sort(sortBy);
		const response = await request.exec();

		if (redux)
			dispatch({
				type: FACT.FETCH.SUCCESS,
				payload: { ...response, end: all ? true : response.end, id }
			});
		return response;
	} catch (error) {
		if (redux) dispatch({ type: FACT.FETCH.FAILURE, payload: error.message });
		throw new error(error.message);
	}
};

export const create = payload => {
	return async dispatch => {
		try {
			dispatch({ type: FACT.CREATE.REQUEST });
			const response = await database.create({ entity }).data(payload).exec();
			dispatch({ type: FACT.CREATE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			console.log(error);
			dispatch({ type: FACT.CREATE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const update = payload => {
	return async dispatch => {
		try {
			dispatch({ type: FACT.UPDATE.REQUEST });
			const response = await database.update({ entity, id: payload.Id }).data(payload).exec();
			console.log('response', response);
			dispatch({ type: FACT.UPDATE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			dispatch({ type: FACT.UPDATE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const deleted = id => {
	return async dispatch => {
		try {
			dispatch({ type: FACT.DELETE.REQUEST });
			const response = await database.delete({ entity, id }).exec();
			console.log('response', response);
			dispatch({ type: FACT.DELETE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			console.log(error);
			dispatch({ type: FACT.DELETE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const setForm = (payload = null) => ({ type: FACT.SETFORM, payload });
export const toggle = (payload = true) => ({ type: FACT.MODAL, payload });
