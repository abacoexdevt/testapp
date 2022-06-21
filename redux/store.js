import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import cases from './reducers/cases';
import customers from './reducers/customers';
import users from './reducers/users';
import risk from './reducers/riskAssesment';
import fact from './reducers/factFinding';
import aml from './reducers/amlRemarks';
import members from './reducers/members';
import userTypes from './reducers/userTypes';

const reducers = combineReducers({
	aml,
	cases,
	customers,
	fact,
	members,
	risk,
	users,
	userTypes
});

export default createStore(reducers, applyMiddleware(thunk));
