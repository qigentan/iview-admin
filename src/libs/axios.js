import axios from "axios";

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    if (response) {
      // store.commit("loadingStatus", false);
    }
    if (response.config._getAll) {
      return response;
    }
    if (response.status === 200) {
      if (response.data.code == 10000) {
        // console.log(123);
      }
      // store.commit("loadingStatus", false);
      return response.data;
    }
    return Promise.reject(response);
  },
  function(error) {
    if (error.response && error.response.status === 401) {
      // console.log(token, token.getNewToken);
    }
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axios;
