import apiBackendInstance from "@/utils/axios";

interface LooseObject {
  [key: string | number]: any;
}

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export const getData = async (api_url: string) => {
  let resData: any;
  await apiBackendInstance
    .get(`${api_url}`, config)
    .then((res) => {
      resData = res;
    })
    .catch((err) => {
      resData = err;
    });
  if (resData) {
    return resData.data;
  }
  return {};
};

export const postData = async (api_url: string, payload: LooseObject) => {
  let resData: any;
  await apiBackendInstance
    .post(`${api_url}`, payload, config)
    .then((res) => {
      resData = res.data;
    })
    .catch((err) => {
      resData = err.response.data;
    });
  return resData;
};

export const updateData = async (api_url: string, payload: LooseObject) => {
  let resData: any;
  await apiBackendInstance
    .put(`${api_url}`, payload, config)
    .then((res) => {
      resData = res;
    })
    .catch((err) => {
      resData = err.response.data;
    });
  if (resData) {
    return resData.data;
  }
  return {};
};

export const deleteData = async (api_url: string) => {
  let resData: any;
  await apiBackendInstance
    .delete(`${api_url}`, config)
    .then((res) => {
      resData = res.data;
    })
    .catch((err) => {
      resData = err.response.data;
    });
  return resData;
};
