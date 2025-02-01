import { axiosInstance } from '../utils/apiUtils';

export const fetchCollections = async () => {
  const response = await axiosInstance.get('/collections');
  return response.data;
};

export const createCollection = async (data) => {
  for (const [key, value] of data.entries()) {
    console.log(`${key}:--->>`, value);
  }
  const response = await axiosInstance.post('/collections/create', data);
  // console.log("-------------->>>>>>",response)
  return response.data;
};

export const updateCollection = async (id, data) => {
  const response = await axiosInstance.put(`/collections/update/${id}`, data);
  return response.data;
};

export const deleteCollection = async (id) => {
  const response = await axiosInstance.delete(`/collections/delete/${id}`);
  return response.data;
};


