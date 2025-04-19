import axios from "axios";
import { GENERAL_ERROR_RESPONSE_CODES, SERVER_ENDPOINT } from "@/utils/config";
import { ENV_PROD } from "@/utils/defines";
import { useStore } from "@/stores/storeContext";
import { toast } from "react-toastify";
import useTranslation from "next-translate/useTranslation";
import { csrf, getCookie, showStandardNotification } from "@/utils/helpers";

interface Options {
  withLoading?: boolean;
  withError?: boolean;
}

// for main server calls
export const useServer = () => {
  const {
    commonStore: { loading, startLoading, stopLoading },
    userStore: { user },
  } = useStore();

  const { t } = useTranslation("translations");

  const getErrorMessage = (err: any) => {
    if (err.response?.data?.tag) {
      let errorMessage = err.response.data.tag;

      if (Array.isArray(errorMessage)) {
        return errorMessage.map((error) => `- ${t(error)}`).join("\n");
      }

      return t(errorMessage);
    }

    if (err.response?.data?.message) {
      return err.response.data.message;
    }

    return t("api.general_error");
  };

  const sendRequest = async (
    url: string,
    method: string = "GET",
    data: any = {},
    headers: object = {},
    options: Options = {
      withLoading: true,
      withError: true,
    }
  ) => {
    if (options?.withLoading) startLoading();

    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;

    const sessionCookie = getCookie(process.env.NEXT_PUBLIC_SESSION_ID);

    if (!sessionCookie) {
      await csrf();
    }

    axios.defaults.headers.common["X-CSRF-TOKEN"] = decodeURIComponent(
      sessionCookie ?? ""
    );

    let requestData = {};

    if (["GET", "DELETE"].includes(method)) {
      requestData = {
        url: `${SERVER_ENDPOINT}/api${url}?${new URLSearchParams(
          (data as Record<string, string>) || {}
        ).toString()}`,
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
      !ENV_PROD && console.log(err.response?.data ?? err);

      if (options?.withError) {
        let errorMessage = getErrorMessage(err);

        if (GENERAL_ERROR_RESPONSE_CODES.includes(err.status)) {
          errorMessage = t("api.general_error");
        }

        showStandardNotification("error", errorMessage);
      }
    } finally {
      stopLoading();
    }
  };

  return { loading, sendRequest };
};
