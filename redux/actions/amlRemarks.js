import { database } from '../../sdk';
import actions from './actionTypes';
const { AML } = actions;
const entity = 'Aml';

export const fetch = payload => async dispatch => {
	const { all = false, filter = {}, id = null, page = 1, redux = true, size = 20, sortBy = {} } = payload;

	try {
		if (redux) dispatch({ type: AML.FETCH.REQUEST });
		let request = database.get({ entity }).page(page).size(size);
		if (all) request = request.all();
		if (filter) request = request.filter(filter);
		if (id) request = request.autoPopulate(false).setId(id);
		if (sortBy) request = request.sort(sortBy);
		const response = await request.exec();

		if (redux)
			dispatch({
				type: AML.FETCH.SUCCESS,
				payload: { ...response, end: all ? true : response.end, id }
			});
		return response;
	} catch (error) {
		if (redux) dispatch({ type: AML.FETCH.FAILURE, payload: error.message });
		throw new error(error.message);
	}
};

export const create = payload => {
	return async dispatch => {
		try {
			dispatch({ type: AML.CREATE.REQUEST });
			const response = await database.create({ entity }).data(payload).exec();
			dispatch({ type: AML.CREATE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			console.log(error);
			dispatch({ type: AML.CREATE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const update = payload => {
	return async dispatch => {
		try {
			dispatch({ type: AML.UPDATE.REQUEST });
			const response = await database.update({ entity, id: payload.Id }).data(payload).exec();
			console.log('response', response);
			dispatch({ type: AML.UPDATE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			dispatch({ type: AML.UPDATE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const deleted = id => {
	return async dispatch => {
		try {
			dispatch({ type: AML.DELETE.REQUEST });
			const response = await database.delete({ entity, id }).exec();
			console.log('response', response);
			dispatch({ type: AML.DELETE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			console.log(error);
			dispatch({ type: AML.DELETE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const setForm = (payload = null) => ({ type: AML.SETFORM, payload });
export const toggle = (payload = true) => ({ type: AML.MODAL, payload });
