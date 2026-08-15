import apiClient from "./client";

export const productApi = {
  getProducts: () => apiClient.get("/products"),
  getProductById: (id) => apiClient.get(`/products/${id}`),
};
