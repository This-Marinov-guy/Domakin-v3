import axios from "axios";
import { getApiUrl, SERVER_ENDPOINT } from "@/utils/config";
import { ENV_PROD } from "@/utils/defines";
import { useStore } from "@/stores/storeContext";
import { toast } from "react-toastify";
import useTranslation from "next-translate/useTranslation";

interface Options {
  withLoading?: boolean;
  withError?: boolean;
}

// for external API calls
export const useApi = () => {
  const {
    commonStore: { loading, startLoading, stopLoading },
  } = useStore();

  const { t } = useTranslation("translations");

  const user = {
    token: "",
  };

  const sendApiRequest = async (
    registeredApi: string,
    method: string = "GET",
    data: object | null = null,
    headers: object = {},
    options: Options = {
      withLoading: true,
      withError: true,
    }
  ) => {
    if (options?.withLoading) startLoading();

    if (user && !!user.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    }

    // Add interface to request body (handles both objects and FormData)
    let requestBody: any = data;
    
    if (data instanceof FormData) {
      // For FormData, append the interface field
      const formData = new FormData();
      // Copy all existing entries
      for (const [key, value] of data.entries()) {
        formData.append(key, value);
      }
      formData.append("interface", "web");
      requestBody = formData;
    } else if (data !== null) {
      // For regular objects, spread and add interface
      requestBody = {
        ...data,
        interface: "web",
      };
    } else {
      // If data is null, create object with interface
      requestBody = {
        interface: "web",
      };
    }

    try {
      const response = await axios.request({
        url: getApiUrl(registeredApi),
        method,
        data: requestBody,
        headers,
      });

      if (options?.withError && !response.data.status) {
        const errorMessage = response?.data.tag
          ? t(response?.data.tag)
          : response?.data.message ?? t("api.general_error");

        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }

      return response.data;
    } catch (err: any) {
      !ENV_PROD && console.log(err.response?.data ?? err);

      if (options?.withError) {
        const errorMessage = err.response?.data.tag
          ? t(err.response?.data.tag)
          : err.response?.data.message ?? t("api.general_error");

        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }

      return err?.response?.data;
    } finally {
      stopLoading();
    }
  };

  return { loading, sendApiRequest };
};
