import { catSteinStore } from "../api/api-method";

const initialState = {
  areas: [],
  loading: false,
};

export function areasReducer(state = initialState, action) {
  switch (action.type) {
    case AREAS_FETCH:
      return {
        ...state,
        areas: action.payload.areas,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}

// selectors
export const getAreas = (state) => state.areas.areas;
export const getLoading = (state) => state.areas.loading;

// action creators
export const areasFetch = (areas) => ({
  type: AREAS_FETCH,
  payload: { areas },
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export function fetchAreas() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(setLoading(true));
      catSteinStore.read("option_area")
        .then(res => {
          const data = res;
          dispatch(areasFetch(data));
          dispatch(setLoading(false));
          resolve(data);
        })
        .catch(err => {
          dispatch(setLoading(false));
          console.error("Error: ", err);
          reject(err);
        });
    });
  }
}

// action types
export const AREAS_FETCH = "areas/areasFetch";
export const SET_LOADING = "areas/setLoading";