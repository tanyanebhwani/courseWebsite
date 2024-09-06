import { setCourses } from '../actions/courseActions';

const initialState = {
    courses: [],
};

const courseReducer = (state = initialState, action) => {
    switch (action.type) {
        case setCourses:
            return {
                ...state,
                courses: action.payload,
            };
        default:
            return state;
    }
};

export default courseReducer;