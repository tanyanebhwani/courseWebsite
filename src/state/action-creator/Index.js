export const SET_COURSES = 'SET_COURSES';

export const setCourses = (courses) => {
    return {
        type: SET_COURSES,
        payload: courses,
    };
};

export const fetchCourses = () => async (dispatch) => {
    try {
        const response = await fetch('http://localhost:5000/api/courses');        
        // Once the data is fetched, dispatch the setCourses action
        dispatch(setCourses(response.data));
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
};
