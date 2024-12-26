"use client";
import menu_data from "@/data/home-data/MenuData";
import Link from "next/link.js";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

import logo from "@/assets/img/logo-3.png";
import useTranslation from "next-translate/useTranslation";
import ChangeLanguage from "./ChangeLanguage";
import { useStore } from "@/stores/storeContext";
import { LOGIN_MODAL } from "@/utils/defines";

const NavMenu = () => {
  const pathname = usePathname();
  const [navTitle, setNavTitle] = useState("");

  const { t } = useTranslation("translations");

  const {modalStore} = useStore();  

  //openMobileMenu
  const openMobileMenu = (menu: any) => {
    if (navTitle === menu) {
      setNavTitle("");
    } else {
      setNavTitle(menu);
    }
  };

  return (
    <ul className="navbar-nav align-items-lg-center">
      <li className="d-block d-lg-none">
        <div className="logo">
          <Link href="/" className="d-block">
            <Image src={logo} alt="" />
          </Link>
        </div>
      </li>

      <li className="d-block d-lg-none">
        <ChangeLanguage />
      </li>

      {menu_data.map((menu: any) => (
        <li key={menu.id} className={`nav-item dropdown ${menu.class_name}`}>
          <Link
            href={menu.link}
            className={`nav-link ${menu.has_dropdown && "dropdown-toggle"} ${
              pathname === menu.link ? "active" : ""
            }
                     ${navTitle === menu.title ? "show" : ""}`}
            onClick={() => openMobileMenu(menu.title)}
          >
            {t(menu.title)}
          </Link>
          {menu.has_dropdown && (
            <>
              <ul
                className={`dropdown-menu ${
                  navTitle === menu.title ? "show" : ""
                }`}
              >
                {menu.sub_menus &&
                  menu.sub_menus.map((sub_m: any, i: any) => (
                    <li key={i}>
                      <Link
                        href={sub_m.link}
                        className={`dropdown-item ${
                          pathname === sub_m.link ? "active" : ""
                        }`}
                      >
                        <span>{t(sub_m.title)}</span>
                      </Link>
                    </li>
                  ))}
                {menu.menu_column && (
                  <li className="row gx-1">
                    {menu.menu_column.map((item: any) => (
                      <div key={item.id} className="col-lg-4">
                        <div className="menu-column">
                          <h6 className="mega-menu-title">
                            {t(item.mega_title)}
                          </h6>
                          <ul className="style-none mega-dropdown-list">
                            {item.mega_menus.map((mega_m: any, i: any) => (
                              <li key={i}>
                                <Link
                                  href={mega_m.link}
                                  className={`dropdown-item ${
                                    pathname === mega_m.link ? "active" : ""
                                  }`}
                                >
                                  <span>{t(mega_m.title)}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </li>
                )}
              </ul>
            </>
          )}
        </li>
      ))}

      <li className="d-block d-lg-none d-md-inline-block ms-3 mt-20">
        <Link href="/services/add-listing" className="btn-two" target="_blank">
          <span>{t("header.add_listing")}</span>{" "}
          <i className="fa-thin fa-arrow-up-right"></i>
        </Link>
      </li>

      <li className="d-block d-lg-none d-md-inline-block ms-3 mt-10">
        <button
          onClick={() => modalStore.setActiveModal(LOGIN_MODAL)}
          className="btn-fourteen"
        >
          <i className="fa-regular fa-lock"></i>{" "}
          <span>{t("account:authentication.login")}</span>
        </button>
      </li>
    </ul>
  );
};

export default NavMenu;
