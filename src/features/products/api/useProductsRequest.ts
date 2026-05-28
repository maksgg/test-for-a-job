import axios, { isAxiosError } from "axios";
import { ref } from "vue";

export default () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchProducts = async (
    params: { limit?: number; skip?: number } = {},
  ) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await axios.get("https://dummyjson.com/products", {
        params,
      });

      if (response.status >= 400) {
        throw new Error(`Запит завершився зі статусом ${response.status}`);
      }

      return response.data;
    } catch (err: unknown) {
      let errorMessage = "Сталася помилка";

      if (isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      error.value = errorMessage;
      return errorMessage;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    fetchProducts,
    isLoading,
    error,
  };
};
