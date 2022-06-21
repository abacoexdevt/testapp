import { database } from '../../sdk';
import actions from './actionTypes';
const { RISK } = actions;
const entity = 'Risk';

export const fetch = payload => async dispatch => {
	const { all = false, filter = {}, id = null, page = 1, redux = true, size = 20, sortBy = {} } = payload;

	try {
		if (redux) dispatch({ type: RISK.FETCH.REQUEST });
		let request = database.get({ entity }).page(page).size(size);
		if (all) request = request.all();
		if (filter) request = request.filter(filter);
		if (id) request = request.autoPopulate(false).setId(id);
		if (sortBy) request = request.sort(sortBy);
		const response = await request.exec();

		if (redux)
			dispatch({
				type: RISK.FETCH.SUCCESS,
				payload: { ...response, end: all ? true : response.end, id }
			});
		return response;
	} catch (error) {
		if (redux) dispatch({ type: RISK.FETCH.FAILURE, payload: error.message });
		throw new error(error.message);
	}
};

export const create = payload => {
	return async dispatch => {
		try {
			dispatch({ type: RISK.CREATE.REQUEST });
			const { Case } = payload;
			console.log(payload);
			const response = await database.create({ entity }).data(payload).exec();
			const risk = response.data[0];
			await database.update({ entity: 'Case', id: Case }).data({ Risk: risk._id }).exec();

			dispatch({ type: RISK.CREATE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			console.log(error);
			dispatch({ type: RISK.CREATE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const update = payload => {
	return async dispatch => {
		try {
			dispatch({ type: RISK.UPDATE.REQUEST });
			const response = await database.update({ entity, id: payload.Id }).data(payload).exec();
			dispatch({ type: RISK.UPDATE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			dispatch({ type: RISK.UPDATE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const deleted = id => {
	return async dispatch => {
		try {
			dispatch({ type: RISK.DELETE.REQUEST });
			const response = await database.delete({ entity, id }).exec();
			console.log('response', response);
			dispatch({ type: RISK.DELETE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			console.log(error);
			dispatch({ type: RISK.DELETE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const setForm = (payload = null) => ({ type: RISK.SETFORM, payload });
export const toggle = (payload = true) => ({ type: RISK.MODAL, payload });
