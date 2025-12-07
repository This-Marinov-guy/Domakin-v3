import axios from "axios";
import { GENERAL_ERROR_RESPONSE_CODES, SERVER_ENDPOINT } from "@/utils/config";
import { ENV_PROD } from "@/utils/defines";
import { useStore } from "@/stores/storeContext";
import { toast } from "react-toastify";
import { isEmpty } from "lodash";
import useTranslation from "next-translate/useTranslation";
import { csrf, getCookie, showStandardNotification } from "@/utils/helpers";
import React from "react";

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

  const getErrorMessage = (response: any) => {
    if (!isEmpty(response?.data?.tag)) {
      let errorMessage = response.data.tag;

      if (Array.isArray(errorMessage)) {
        if (errorMessage.length === 1) {
          return t(errorMessage[0]);
        }

        const errorElements: React.ReactNode[] = [];
        errorMessage.forEach((error, index) => {
          errorElements.push(
            React.createElement(
              React.Fragment,
              { key: `error-${index}` },
              `- ${t(error)}`,
              index < errorMessage.length - 1 && React.createElement("br", { key: `br-${index}` })
            )
          );
        });

        return React.createElement("div", null, errorElements);
      }

      return t(errorMessage);
    }

    if (response?.data?.message) {
      return response.data.message;
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

      if (options.withError && !response.data.status) {
        const errorMessage = getErrorMessage(response);

        showStandardNotification("error", errorMessage);
      }

      return response.data;
    } catch (err: any) {
      !ENV_PROD && console.log(err.response?.data ?? err);

      if (options?.withError) {
        let errorMessage = getErrorMessage(err.response);

        if (GENERAL_ERROR_RESPONSE_CODES.includes(err.status)) {
          errorMessage = t("api.general_error");
        }

        showStandardNotification("error", errorMessage);
      }      

      return err?.response?.data;
    } finally {
      stopLoading();
    }
  };

  return { loading, sendRequest };
};
