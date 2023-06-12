import { steinStore } from "../api/api-method";

const initialState = {
  users: [],
  loading: false,
};

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case USERS_FETCH:
      return {
        ...state,
        users: action.payload.users,
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
export const getUsers = (state) => state.users.users;
export const getLoading = (state) => state.users.loading;

// action creators
export const usersFetch = (users) => ({
  type: USERS_FETCH,
  payload: { users },
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export function fetchUsers() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(setLoading(true));
      steinStore.read("list")
        .then(res => {
          const data = res;
          dispatch(usersFetch(data));
          dispatch(setLoading(false));
          resolve(data);
        })
        .catch(err => {
          dispatch(setLoading(false));
          console.error("Error: ", err);
          reject(err);
        });
    });
  };
}

export function addUser(user) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(setLoading(true));
      steinStore.append("list", user)
        .then(() => {
          dispatch(fetchUsers())
            .then(res => {
              dispatch(setLoading(false));
              resolve(res);
            })
            .catch(err => {
              dispatch(setLoading(false));
              console.log("Error: ", err);
              reject(err);
            });
        })
        .catch(err => {
          dispatch(setLoading(false));
          console.log("Error: ", err);
          reject(err);
        })
    });
  };
}

export function editUser(user) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(setLoading(true));
      steinStore.edit("list", {
        search: { uuid: user.uuid },
        set: {
          nama: user.nama,
          alamat: user.alamat,
          jenis_kelamin: user.jenis_kelamin,
          tanggal_lahir: user.tanggal_lahir,
          created_at: user.created_at,
          updated_at: user.updated_at,
        }
      })
        .then(() => {
          dispatch(fetchUsers())
            .then(res => {
              dispatch(setLoading(false));
              resolve(res);
            })
            .catch(err => {
              dispatch(setLoading(false));
              console.log("Error: ", err);
              reject(err);
            });
        })
        .catch(err => {
          dispatch(setLoading(false));
          console.log("Error: ", err);
          reject(err);
        })
    })
  }
}

export function deleteUser(user) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(setLoading(true));
      steinStore.delete("list", {
        search: { uuid: user.uuid },
      })
        .then(() => {
          dispatch(fetchUsers())
            .then(res => {
              dispatch(setLoading(false));
              resolve(res);
            })
            .catch(err => {
              dispatch(setLoading(false));
              console.log("Error: ", err);
              reject(err);
            });
        })
        .catch(err => {
          dispatch(setLoading(false));
          console.log("Error: ", err);
          reject(err);
        })
    })
  }
}

// action types
export const USERS_FETCH = "users/usersFetch";
export const SET_LOADING = "users/setLoading";