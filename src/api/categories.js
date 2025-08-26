import { fetchJSON } from './client';

export const getAllCategories = () => fetchJSON('/categories');

export const createCategory = (categoryName, rewardPercentage = 0) =>
  fetchJSON('/categories', {
    method: 'POST',
    body: JSON.stringify({ categoryName, rewardPercentage }),
  });

export const renameCategory = (categoryId, categoryName) =>
  fetchJSON(`/categories/${categoryId}`, {
    method: 'PUT',
    body: JSON.stringify({ categoryName }),
  });

export const deleteCategory = (categoryId) =>
  fetchJSON(`/categories/${categoryId}`, { method: 'DELETE' });
