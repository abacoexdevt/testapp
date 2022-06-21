import { HYDRATE } from 'next-redux-wrapper';
import actions from '../actions/actionTypes';
import { keyBy } from 'lodash';

const { MEMBER } = actions;

const initialState = {
	currentPage: 0,
	data: [],
	end: false,
	error: null,
	form: null,
	formLoading: false,
	loading: true,
	lists: [],
	modal: false,
	total: 0,
	totalResult: 0
};

const reducer = (state = initialState, action) => {
	const { payload, type } = action;

	switch (type) {
		// case HYDRATE:
		// 	return { ...state, ...payload.employees };
		case MEMBER.SETFORM:
			return { ...state, form: payload };
		case MEMBER.MODAL:
			return { ...state, modal: payload };

		case MEMBER.FETCH.REQUEST:
			return { ...state, loading: true };
		case MEMBER.FETCH.SUCCESS:
			const { currentPage, data, id, ...rest } = payload;

			if (id)
				return {
					...state,
					form: data.length !== 0 ? data[0] : null
				};
			return {
				...state,
				...rest,
				currentPage: currentPage ? currentPage : state.currentPage,
				data: !currentPage || currentPage === 1 ? [...data] : [...state.data, ...data],
				loading: false
			};
		case MEMBER.FETCH.FAILURE:
			return { ...state, formLoading: true };

		case MEMBER.CREATE.REQUEST:
			return { ...state, formLoading: true };
		case MEMBER.CREATE.SUCCESS:
			return {
				...state,
				data: [...payload.data, ...state.data].sort((a, b) => b._id - a._id),
				formLoading: false
			};
		case MEMBER.CREATE.FAILURE:
			return { ...state, formLoading: false };

		case MEMBER.UPDATE.REQUEST:
			return { ...state, formLoading: true };
		case MEMBER.UPDATE.SUCCESS:
			return {
				...state,
				data: state.data.map(d => (d._id === payload.data[0]._id ? payload.data[0] : d)),
				formLoading: false
			};
		case MEMBER.UPDATE.FAILURE:
			return { ...state, formLoading: false };

		case MEMBER.DELETE.REQUEST:
			return { ...state, formLoading: true };
		case MEMBER.DELETE.SUCCESS:
			return { ...state, data: state.data.filter(d => d._id !== payload.data._id), formLoading: false };
		case MEMBER.DELETE.FAILURE:
			return { ...state, formLoading: false };

		default:
			return state;
	}
};

export default reducer;
