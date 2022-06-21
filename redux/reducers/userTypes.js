import { HYDRATE } from 'next-redux-wrapper';
import actions from '../actions/actionTypes';
import { keyBy } from 'lodash';

const { USERTYPE } = actions;

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
		case HYDRATE:
			return { ...state, ...payload.employees };
		case USERTYPE.SETFORM:
			return { ...state, form: payload };
		case USERTYPE.MODAL:
			return { ...state, modal: payload };

		case USERTYPE.FETCH.REQUEST:
			return { ...state, loading: true };
		case USERTYPE.FETCH.SUCCESS:
			const { currentPage, data, id, ...rest } = payload;

			if (id)
				return {
					...state,
					form: data.length !== 0 ? data[0] : null
				};
			return {
				...state,
				...rest,
				currentPage,
				data:
					!currentPage || currentPage === 1
						? [...data].sort((a, b) => b._id - a._id)
						: [...state.data, ...data].sort((a, b) => b._id - a._id),
				loading: false
			};
		case USERTYPE.FETCH.FAILURE:
			return { ...state, formLoading: true };

		case USERTYPE.CREATE.REQUEST:
			return { ...state, formLoading: true };
		case USERTYPE.CREATE.SUCCESS:
			return {
				...state,
				data: [...payload.data, ...state.data].sort((a, b) => b._id - a._id),
				formLoading: false
			};
		case USERTYPE.CREATE.FAILURE:
			return { ...state, formLoading: false };

		case USERTYPE.UPDATE.REQUEST:
			return { ...state, formLoading: true };
		case USERTYPE.UPDATE.SUCCESS:
			return {
				...state,
				data: state.data.map(d => (d._id === payload.data[0]._id ? payload.data[0] : d)),
				formLoading: false
			};
		case USERTYPE.UPDATE.FAILURE:
			return { ...state, formLoading: false };

		case USERTYPE.DELETE.REQUEST:
			return { ...state, formLoading: true };
		case USERTYPE.DELETE.SUCCESS:
			return { ...state, data: state.data.filter(d => d._id !== payload.data._id), formLoading: false };
		case USERTYPE.DELETE.FAILURE:
			return { ...state, formLoading: false };

		default:
			return state;
	}
};

export default reducer;
