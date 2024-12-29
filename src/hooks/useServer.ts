import axios from "axios";
import { SERVER_ENDPOINT } from "@/utils/config";
import { isProd } from "@/utils/defines";
import { useStore } from "@/stores/storeContext";
import { toast } from "react-toastify";
import useTranslation from "next-translate/useTranslation";

interface Options {
  withLoading?: boolean;
  withError?: boolean;
}

// for main server calls
export const useServer = () => {
  const {
    commonStore: { loading, startLoading, stopLoading },
  } = useStore();

  const { t } = useTranslation("translations");

  const user = {
    token: "",
  };

  const sendRequest = async (
    url: string,
    method: string = "GET",
    data: any,
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

    let requestData = {};

    if (["GET", "DELETE"].includes(method)) {
      requestData = {
        url: `${SERVER_ENDPOINT}/api${url}?${new URLSearchParams(data as Record<string, string> || {}).toString()}`,
        method,
        data: {},
        headers,
      };
    } else {
      requestData = {
        url: SERVER_ENDPOINT + "/api" + url,
        method,
        data,
        headers,
      };
    }

    try {
      const response = await axios.request(requestData);

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
      !isProd && console.log(err.response?.data ?? err);

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
    } finally {
      stopLoading();
    }
  };

  return { loading, sendRequest };
};
