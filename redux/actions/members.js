import { database } from '../../sdk';
import actions from './actionTypes';
const { MEMBER } = actions;
const entity = 'm_member';

export const fetch = payload => async dispatch => {
	const { all = false, filter = {}, id = null, page = 1, redux = true, size = 20, sortBy = {} } = payload;

	try {
		if (redux) dispatch({ type: MEMBER.FETCH.REQUEST });
		let request = database.get({ entity }).page(page).size(size);
		if (all) request = request.all();
		if (filter) request = request.filter(filter);
		if (id) request = request.autoPopulate(false).setId(id);
		if (sortBy) request = request.sort(sortBy);
		const response = await request.exec();

		if (redux)
			dispatch({
				type: MEMBER.FETCH.SUCCESS,
				payload: { ...response, end: all ? true : response.end, id }
			});
		return response;
	} catch (error) {
		console.log(error);
		if (redux) dispatch({ type: MEMBER.FETCH.FAILURE, payload: error.message });
		throw new error(error.message);
	}
};

export const create = payload => {
	return async dispatch => {
		try {
			dispatch({ type: MEMBER.CREATE.REQUEST });
			const response = await database.create({ entity }).data(payload).exec();
			dispatch({ type: MEMBER.CREATE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			console.log(error);
			dispatch({ type: MEMBER.CREATE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const update = payload => {
	return async dispatch => {
		try {
			dispatch({ type: MEMBER.UPDATE.REQUEST });
			const response = await database.update({ entity, id: payload.Id }).data(payload).exec();
			console.log('response', response);
			dispatch({ type: MEMBER.UPDATE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			dispatch({ type: MEMBER.UPDATE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const deleted = id => {
	return async dispatch => {
		try {
			dispatch({ type: MEMBER.DELETE.REQUEST });
			const response = await database.delete({ entity, id }).exec();
			console.log('response', response);
			dispatch({ type: MEMBER.DELETE.SUCCESS, payload: response });

			return response;
		} catch (error) {
			console.log(error);
			dispatch({ type: MEMBER.DELETE.FAILURE });
			throw new Error(error.message);
		}
	};
};

export const setForm = (payload = null) => ({ type: MEMBER.SETFORM, payload });
export const toggle = (payload = true) => ({ type: MEMBER.MODAL, payload });
