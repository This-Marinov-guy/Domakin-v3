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
  version?: number;
}

const defaultOptions: Options = {
  withLoading: true,
  withError: true,
  version: 1,
};

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
      version: 1,
    }
  ) => {
    options = { ...defaultOptions, ...options };

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
      // Add interface to query params
      const queryParams = new URLSearchParams(
        (data as Record<string, string>) || {}
      );
      queryParams.set("interface", "web");

      requestData = {
        url: `${SERVER_ENDPOINT}/api/v${options.version}${url}?${queryParams.toString()}`,
        method,
        data: {},
        headers,
      };
    } else {
      // Add interface to request body (handles both objects and FormData)
      let requestBody = data;

      if (data instanceof FormData) {
        // For FormData, append the interface field
        requestBody = new FormData();
        // Copy all existing entries
        for (const [key, value] of data.entries()) {
          requestBody.append(key, value);
        }
        requestBody.append("interface", "web");
      } else {
        // For regular objects, spread and add interface
        requestBody = {
          ...(data || {}),
          interface: "web",
        };
      }

      requestData = {
        url: SERVER_ENDPOINT + "/api" + "/v" + options.version + url,
        method,
        data: requestBody,
        headers,
      };
    }

    try {
      const response = await axios.request(requestData);

      if (options.withError && !response.data.status) {
        const errorMessage = getErrorMessage(response);

        showStandardNotification("error", errorMessage);
      }

      if (response.data?.warning) {
        showStandardNotification("warning", response.data.warning);
      }

      return response.data;
    } catch (err: any) {
      !ENV_PROD && console.log(err.response?.data ?? err);

      // only show error if the response has no status property
      if (options?.withError && !err.response.data.hasOwnProperty('status')) {
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
