const initialState = {
  title: "",
};

export function headerReducer(state = initialState, action) {
  switch (action.type) {
    case TITLE_CHANGED:
      return {
        ...state,
        title: action.payload,
      };

    default: 
      return state;
  }
}

// selectors
export const getTitle = (state) => state.header.title;

// action creators
export const titleChanged = (title) => ({
  type: TITLE_CHANGED,
  payload: title,
});

// action types
export const TITLE_CHANGED = 'header/titleChanged';