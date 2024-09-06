// reducers/index.js
import { combineReducers } from 'redux';
import courseReducer from './reducer/Index';

const rootReducer = combineReducers({
    courses: courseReducer,
});

export default rootReducer;
