import { useQuery } from "@tanstack/react-query";
import { productApi } from "../api/product.api";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await productApi.getProducts();
      return response.data;
    },
  });
};
