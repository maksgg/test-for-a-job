import axios, { isAxiosError } from "axios";
import { ref } from "vue";

export default () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchProducts = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await axios.get(
        "https://dummyjson.com/products?limit=170",
      );

      // Хоча axios за замовчуванням кидає помилку для статусів 4xx/5xx,
      // ми можемо додати явну перевірку за потреби.
      if (response.status >= 400) {
        throw new Error(`Запит завершився зі статусом ${response.status}`);
      }

      return response.data.products;
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
