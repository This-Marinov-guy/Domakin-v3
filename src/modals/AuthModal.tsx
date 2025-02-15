"use client";

import Image from "next/image";
import Modal from "react-bootstrap/Modal";
import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";
import { useEffect, useState, useRef } from "react";
import loginIcon_1 from "@/assets/images/icon/google.png";
import loginIcon_2 from "@/assets/images/icon/facebook.png";
import RegisterForm from "@/components/forms/RegisterForm";
import { useStore } from "@/stores/storeContext";
import { LOGIN_IN, LOGIN_MODAL, SIGN_UP } from "@/utils/defines";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { Provider } from "@supabase/supabase-js";
import supabase from "@/utils/supabase";
import useTranslation from "next-translate/useTranslation";
import { useServer } from "@/hooks/useServer";
import { showGeneralError, showStandardNotification } from "@/utils/helpers";

const AuthModal = () => {
  const mountedRef = useRef(true);
  const [isClient, setIsClient] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState(LOGIN_IN);
  const { t } = useTranslation("account");
  const { modalStore } = useStore();
  const {
    commonStore: { loading, startLoading, stopLoading },
  } = useStore();
  const { sendRequest } = useServer();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !router.isReady) return;

    const { query } = router;
    if (query.signup) {
      setActiveTab(SIGN_UP);
      setShowModal(true);
      modalStore.setActiveModal(LOGIN_MODAL);
    } else if (query.login) {
      setActiveTab(LOGIN_IN);
      setShowModal(true);
      modalStore.setActiveModal(LOGIN_MODAL);
    }
  }, [isClient, router.isReady, JSON.stringify(router.query)]);

  const handleTabClick = (tab: number) => {
    setActiveTab(tab);

    const newQuery: any = { ...router.query };
    if (tab === LOGIN_IN) {
      delete newQuery.signup;
      newQuery.login = 1;
    } else {
      delete newQuery.login;
      newQuery.signup = 1;
    }

    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const handleClose = () => {
    const newQuery = { ...router.query };
    delete newQuery.login;
    delete newQuery.signup;

    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );

    setShowModal(false);
    modalStore.closeAll();
  };

  const signInWithSSO = async (provider: Provider) => {
    const TIMEOUT_DURATION = 120000;
    const POLL_INTERVAL = 1000;

    try {
      startLoading();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
          queryParams: { access_type: "offline", prompt: "consent" },
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("No OAuth URL returned");

      const popup = window.open(
        data.url,
        "Login",
        "width=600,height=700,scrollbars=yes"
      );
      if (!popup) throw new Error("Popup blocked");

      const authPromise = new Promise((resolve, reject) => {
        const startTime = Date.now();

        const checkAuth = async () => {
          try {
            if (Date.now() - startTime > TIMEOUT_DURATION) {
              throw new Error("Authentication timeout");
            }

            if (!popup || popup.closed) {
              const {
                data: { session },
              } = await supabase.auth.getSession();
              if (session) {
                resolve(session);
              } else {
                throw new Error("Authentication cancelled");
              }
              return;
            }

            if (mountedRef.current) {
              setTimeout(checkAuth, POLL_INTERVAL);
            }
          } catch (error) {
            reject(error);
          }
        };

        checkAuth();
      });

      const session: any = await authPromise;

      if (mountedRef.current && session) {
        const responseData = await sendRequest("/register", "POST", {
          isSSO: true,
          name: session.user.user_metadata.full_name,
          email: session.user.user_metadata.email,
          phone: session.user.phone,
          profile_picture: session.user.user_metadata.avatar_url,
        });

        if (responseData?.status) {
          modalStore.closeAll();
          router.push("/account");
        } else {
          throw new Error("registration_failed");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorKey =
          error.message.includes("auth_") ||
          error.message.includes("popup_") ||
          error.message.includes("registration_")
            ? error.message
            : "general_error";

        showGeneralError(error.message ?? t("api.general_error"));
      } else {
        showGeneralError(t("api.general_error"));
      }
    } finally {
      if (mountedRef.current) {
        stopLoading();
      }
    }
  };

  if (!isClient) return null;

  return (
    <Modal
      show={showModal && modalStore.modals[LOGIN_MODAL]}
      onHide={handleClose}
      size="lg"
      aria-labelledby="login-modal"
    >
      <div className="container">
        <div className="user-data-form">
          <button
            type="button"
            className="btn-close"
            onClick={handleClose}
          ></button>
          <div className="form-wrapper m-auto">
            <ul className="nav nav-tabs w-100">
              {[
                { id: LOGIN_IN, text: t("authentication.login") },
                { id: SIGN_UP, text: t("authentication.register") },
              ].map((tab) => (
                <li
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className="nav-item"
                >
                  <button
                    className={`nav-link ${
                      activeTab === tab.id ? "active" : ""
                    }`}
                  >
                    {tab.text}
                  </button>
                </li>
              ))}
            </ul>
            <div className="tab-content mt-30">
              {activeTab === LOGIN_IN && <LoginForm />}
              {activeTab === SIGN_UP && <RegisterForm />}
            </div>
            <div className="d-flex align-items-center mt-30 mb-10">
              <div className="line"></div>
              <span className="pe-3 ps-3 fs-6">
                {t("translations:common.or").toUpperCase()}
              </span>
              <div className="line"></div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <button
                  onClick={() => signInWithSSO("google")}
                  disabled={loading}
                  className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10"
                >
                  <Image src={loginIcon_1} alt="Google" />
                  <span className="ps-3">Google</span>
                </button>
              </div>
              <div className="col-sm-6">
                <button
                  onClick={() => signInWithSSO("facebook")}
                  disabled={loading}
                  className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10"
                >
                  <Image src={loginIcon_2} alt="Facebook" />
                  <span className="ps-3">Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default observer(AuthModal);
