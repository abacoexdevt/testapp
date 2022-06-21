import { HYDRATE } from 'next-redux-wrapper';
import actions from '../actions/actionTypes';
import { keyBy } from 'lodash';

const { AML } = actions;

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
			return { ...state, ...payload };
		case AML.SETFORM:
			return { ...state, form: payload };
		case AML.MODAL:
			return { ...state, modal: payload };

		case AML.FETCH.REQUEST:
			return { ...state, loading: true };
		case AML.FETCH.SUCCESS:
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
				data:
					!currentPage || currentPage === 1
						? [...data].sort((a, b) => b._id - a._id)
						: [...state.data, ...data].sort((a, b) => b._id - a._id),
				loading: false
			};
		case AML.FETCH.FAILURE:
			return { ...state, formLoading: true };

		case AML.CREATE.REQUEST:
			return { ...state, formLoading: true };
		case AML.CREATE.SUCCESS:
			return {
				...state,
				data: [...payload.data, ...state.data].sort((a, b) => b._id - a._id),
				formLoading: false
			};
		case AML.CREATE.FAILURE:
			return { ...state, formLoading: false };

		case AML.UPDATE.REQUEST:
			return { ...state, formLoading: true };
		case AML.UPDATE.SUCCESS:
			return {
				...state,
				data: state.data.map(d => (d._id === payload.data[0]._id ? payload.data[0] : d)),
				formLoading: false
			};
		case AML.UPDATE.FAILURE:
			return { ...state, formLoading: false };

		case AML.DELETE.REQUEST:
			return { ...state, formLoading: true };
		case AML.DELETE.SUCCESS:
			return { ...state, data: state.data.filter(d => d._id !== payload.data._id), formLoading: false };
		case AML.DELETE.FAILURE:
			return { ...state, formLoading: false };

		default:
			return state;
	}
};

export default reducer;
