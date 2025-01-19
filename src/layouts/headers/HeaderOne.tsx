"use client";
import NavMenu from "./Menu/NavMenu";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import UseSticky from "@/hooks/UseSticky";
import AuthModal from "@/modals/AuthModal";

import ChangeLanguage from "./Menu/ChangeLanguage";
import useTranslation from "next-translate/useTranslation";
import { logoByTheme } from "@/utils/config";
import { useStore } from "@/stores/storeContext";
import { ENV_PROD, LOGIN_MODAL } from "@/utils/defines";
import { useRouter } from "next/router";

const HeaderOne = ({ style }: any) => {
  const { sticky } = UseSticky();

  const { modalStore } = useStore();

  const { t } = useTranslation("translations");

  const router = useRouter();

const handleOpenLogin = () => {
    router.push({
      pathname: router.pathname,
      query: {
        login: 1
      },
    });

    modalStore.setActiveModal(LOGIN_MODAL);
  };

  return (
    <header
      className={`theme-main-menu menu-overlay menu-style-one sticky-menu ${
        sticky && "fixed"
      }`}
    >
      {/* {!style && (
           <div className="alert-wrapper text-center">
             <p className="fs-16 m0 text-white">
               The{" "}
               <Link href="/listing_01" className="fw-500">
                 flash sale
               </Link>{" "}
               go on. The offer will end in — <span>This Sunday</span>
             </p>
           </div>
         )} */}
      <div className="inner-content px-10">
        <div className="top-header position-relative">
          <div className="d-flex align-items-center justify-content-between">
            <div className="logo order-lg-0">
              <Link href="/" className="mt-5 d-flex align-items-center">
                <Image className="round-logo" src={logoByTheme()} alt="" />
              </Link>
            </div>
            <div className="right-widget ms-auto ms-lg-0 me-3 me-lg-0 order-lg-3">
              <ul className="d-flex align-items-center style-none">
                <li className="d-none d-lg-inline-block ms-3">
                  <ChangeLanguage />
                </li>
                <li className="d-none d-lg-inline-block ms-3">
                  <Link href="/services/add-listing" className="btn-two">
                    <span>{t("header.add_listing")}</span>
                    <i className="fa-thin fa-arrow-up-right"></i>
                  </Link>
                </li>

                {!ENV_PROD && (
                  <li className="d-none d-lg-inline-block ms-3">
                    <button onClick={handleOpenLogin} className="btn-fourteen">
                      <i className="fa-regular fa-lock"></i>{" "}
                      <span>{t("account:authentication.login")}</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
            <nav className="navbar navbar-expand-lg p0 order-lg-2">
              <button
                className="navbar-toggler d-block d-lg-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <NavMenu />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderOne;
