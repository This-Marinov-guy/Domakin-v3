"use client";
import NavMenu from "./Menu/NavMenu";
import Link from "next/link";
import Image from "next/image";
import UseSticky from "@/hooks/UseSticky";

import useTranslation from "next-translate/useTranslation";
import { logoByTheme } from "@/utils/config";

// NOTE: we do not use this
const HeaderOne = () => {
  return null;

  //  const { sticky } = UseSticky();

  //  const { t } = useTranslation("translations");

  //  return (
  //    <>
  //      <header
  //        className={`theme-main-menu menu-overlay menu-style-six sticky-menu ${
  //          sticky ? "fixed" : ""
  //        }`}
  //      >
  //        <div className="inner-content gap-two">
  //          <div className="top-header position-relative">
  //            <div className="d-flex align-items-center">
  //              <div className="logo order-lg-0">
  //                <Link href="/" className="d-flex align-items-center">
  //                  <Image className="round-logo" src={logoByTheme()} alt="" />
  //                </Link>
  //              </div>

  //              <div className="right-widget ms-auto me-3 me-lg-0 order-lg-3">
  //                <ul className="d-flex align-items-center style-none">
  //                  <li className="d-none d-md-inline-block me-4">
  //                    <Link
  //                      href="/services/add-listing"
  //                      className="btn-ten rounded-0"
  //                      target="_blank"
  //                    >
  //                      <span>{t("header.add_listing")}</span>{" "}
  //                      <i className="bi bi-arrow-up-right"></i>
  //                    </Link>
  //                  </li>

  //                  {/* <li>
  //                             <a onClick={() => setIsSearch(true)} style={{ cursor: "pointer" }} className="search-btn-one rounded-circle tran3s d-flex align-items-center justify-content-center"><i className="bi bi-search"></i></a>
  //                          </li> */}
  //                </ul>
  //              </div>

  //              <nav className="navbar navbar-expand-lg p0 ms-lg-5 order-lg-2">
  //                <button
  //                  className="navbar-toggler d-block d-lg-none"
  //                  type="button"
  //                  data-bs-toggle="collapse"
  //                  data-bs-target="#navbarNav"
  //                  aria-controls="navbarNav"
  //                  aria-expanded="false"
  //                  aria-label="Toggle navigation"
  //                >
  //                  <span></span>
  //                </button>
  //                <div
  //                  className="collapse navbar-collapse ms-xl-5"
  //                  id="navbarNav"
  //                >
  //                  <NavMenu />
  //                </div>
  //              </nav>
  //            </div>
  //          </div>
  //        </div>
  //      </header>
  //    </>
  //  );
};

export default HeaderOne;
