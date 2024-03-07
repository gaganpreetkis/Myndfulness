import { apiClient } from "./client";

const endpoint = "/affirmations";

export const allAffirmations = (page) => apiClient.get(`${endpoint}?page=${page}`);
export const affirmationsCategories = () => apiClient.get(`${endpoint}/categories`);
export const affirmationByCategory = (id) => apiClient.get(`${endpoint}?category_id=${id}`);
export const myAffirmations = (data) => apiClient.post(`/user_affirmation_listing`, data);
export const markFavoriteAffirmation = (data) => apiClient.post(`/mark-favourite-affirmation`, data);
export const markUnFavoriteAffirmation = (data) => apiClient.post(`/mark-unfavourite-affirmation`, data);
export const createAffirmation = (data) => apiClient.post(`${endpoint}/create`, data);
export const updateAffirmation = (data) => apiClient.post(`${endpoint}/update`, data);
export const deleteAffirmation = (data) => apiClient.post(`/delete-affirmation`, data);
export const selectTheme = (data) => apiClient.post(`/select_theme`, data);
export const fetchThemes = (data) => apiClient.post(`/themes`, data);
export const fetchFavoriteAffirmations = (data) => apiClient.post(`/favourite-affirmation`, data);

/* export const createRoutines = (data) =>
  apiClient.post(`${endpoint}/create`, data)
export const changeStatus = (routineId) =>
  apiClient.put(`${endpoint}/${routineId}`)
export const updateRoutine = (routineId, data) =>
  apiClient.put(`${endpoint}/edit/${routineId}`, data)
export const allTasks = (page) =>
  apiClient.get(`${endpoint}/tasks?page=${page}`)
export const completeTask = (id) =>
  apiClient.put(`${endpoint}/task-completed/${id}`)
export const incompleteTask = (id) =>
  apiClient.put(`${endpoint}/task-incomplete/${id}`)
export const deleteRoutine = (id) =>
  apiClient.delete(`${endpoint}/delete/${id}`) */
