import axios from "axios";
import { getApiUrl, SERVER_ENDPOINT } from "@/utils/config";
import { isProd } from "@/utils/defines";
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

    try {
      const response = await axios.request({
        url: getApiUrl(registeredApi),
        method,
        data,
        headers,
      });

      return response.data;
    } catch (err: any) {
      !isProd && console.log(err.response.data ?? err);

      if (options?.withError) {
        const errorMessage = err.response.data.tag
          ? t(err.response.data.tag)
          : err.response.data.message ?? t("api.general_error");

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
    } finally {
      stopLoading();
    }
  };

  return { loading, sendApiRequest };
};
