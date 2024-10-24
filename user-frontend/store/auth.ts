// import { getItem } from "~/utils/localStorage";

interface AuthState {
  token: string;
}

export const state = (): AuthState => {
  console.log("---------------------- INIT STORE AUTH ----------------------");
  return {
    token: "",
  };
};

export const getters = {
  getToken(state: AuthState) {
    // if (!state.token) {
    //   getItem("token");
    // }
    return state.token;
  },
};

export const mutations = {
  setToken(state: AuthState, token: string) {
    state.token = token;
  },
};

export const actions = {
  // async setToken({ state, commit }: { state: AuthState }, token: string) {
  //   // make request
  //   // const res = { data: 10 };
  //   // state.counter = res.data;
  //   commit("")
  //   return res.data;
  // },
};
