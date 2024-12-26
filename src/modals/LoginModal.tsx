"use client";

import Image from "next/image";
import Modal from "react-bootstrap/Modal";
import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";
import { useEffect, useState } from "react";

import loginIcon_1 from "@/assets/images/icon/google.png";
import loginIcon_2 from "@/assets/images/icon/facebook.png";
import RegisterForm from "@/components/forms/RegisterForm";
import { useStore } from "@/stores/storeContext";
import { LOGIN_IN, LOGIN_MODAL, SIGN_UP } from "@/utils/defines";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import useTranslation from "next-translate/useTranslation";

const LoginModal = () => {
  const [activeTab, setActiveTab] = useState(LOGIN_IN);

  const { t } = useTranslation("account");

  const { modalStore } = useStore();

  const router = useRouter();
  const { query } = router;

  const tab_title: string[] = [
    t("authentication.login"),
    t("authentication.register"),
  ];

  const handleTabClick = (index: any) => {
    setActiveTab(index);
  };

  const handleClose = () => {
    const newQuery = { ...router.query };

    delete newQuery.login;
    delete newQuery.signup;

    router.push({
      pathname: router.pathname,
      query: newQuery,
    });

    modalStore.closeAll();
  };

  useEffect(() => {
    if (query.signup) {
      setActiveTab(SIGN_UP);
      modalStore.setActiveModal(LOGIN_MODAL);
    }

    if (query.login) {
      setActiveTab(LOGIN_IN);
      modalStore.setActiveModal(LOGIN_MODAL);
    }
  }, [query]);

  return (
    <>
      <Modal
        show={modalStore.modals[LOGIN_MODAL]}
        onHide={handleClose}
        size="lg"
        aria-labelledby="login-modal"
      >
        <div className="container">
          <div className="user-data-form">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleClose}
            ></button>
            <div className="form-wrapper m-auto">
              <ul className="nav nav-tabs w-100">
                {tab_title.map((tab, index) => (
                  <li
                    key={index}
                    onClick={() => handleTabClick(index)}
                    className="nav-item"
                  >
                    <button
                      className={`nav-link ${
                        activeTab === index ? "active" : ""
                      }`}
                    >
                      {tab}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="tab-content mt-30">
                <div
                  className={`tab-pane fade ${
                    activeTab === LOGIN_IN ? "show active" : ""
                  }`}
                >
                  <div className="text-center mb-20">
                    <h2>{t("authentication.welcome_back")}</h2>
                    <p className="fs-20 color-dark">
                      {t("authentication.no_account")}
                      <Link className="ml-5" href="#" onClick={() => handleTabClick(SIGN_UP)}>{t("authentication.sign_up")}</Link>
                    </p>
                  </div>
                  <LoginForm />
                </div>

                <div
                  className={`tab-pane fade ${
                    activeTab === SIGN_UP ? "show active" : ""
                  }`}
                >
                  <div className="text-center mb-20">
                    <h2>{t("authentication.register")}</h2>
                    <p className="fs-20 color-dark">
                      {t("authentication.already_registered")}
                      <Link className="ml-5" href="#" onClick={() => handleTabClick(LOGIN_IN)}>{t("authentication.log_in")}</Link>
                    </p>
                  </div>
                  <RegisterForm />
                </div>
              </div>

              <div className="d-flex align-items-center mt-30 mb-10">
                <div className="line"></div>
                <span className="pe-3 ps-3 fs-6">OR</span>
                <div className="line"></div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <Link
                    href="#"
                    className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10"
                  >
                    <Image src={loginIcon_1} alt="" />
                    <span className="ps-3">Signup with Google</span>
                  </Link>
                </div>
                <div className="col-sm-6">
                  <Link
                    href="#"
                    className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10"
                  >
                    <Image src={loginIcon_2} alt="" />
                    <span className="ps-3">Signup with Facebook</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default observer(LoginModal);
