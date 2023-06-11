import { catSteinStore } from "../api/api-method";

const initialState = {
  sizes: [],
  loading: false,
};

export function sizesReducer(state = initialState, action) {
  switch (action.type) {
    case SIZES_FETCH:
      return {
        ...state,
        sizes: action.payload.sizes,
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
export const getSizes = (state) => state.sizes.sizes;
export const getLoading = (state) => state.sizes.loading;

// action creators
export const sizesFetch = (sizes) => ({
  type: SIZES_FETCH,
  payload: { sizes },
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export function fetchSizes() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(setLoading(true));
      catSteinStore.read("option_size")
        .then(res => {
          const data = res;
          dispatch(sizesFetch(data));
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
export const SIZES_FETCH = "areas/areasFetch";
export const SET_LOADING = "areas/setLoading";