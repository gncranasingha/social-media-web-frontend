import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createPost = async (formData) => {
  try {
    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPostsByUser = async (userId) => {
  try {
    const response = await api.get(`/posts/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllPosts = async () => {
  try {
    const response = await api.get('/posts');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    await api.delete(`/posts/${postId}`);
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (postId, formData) => {
  try {
    const response = await api.put(`/posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (formData) => {
  try {
    const response = await api.put('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};