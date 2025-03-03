import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/storeContext";
import { LOGIN_MODAL } from "@/utils/defines";
import { useRouter } from "next/router";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";
import useTranslation from "next-translate/useTranslation";

const AuthButton = ({ mobile = false }: any) => {
  const {
    modalStore,
    userStore: { user, logout, userLoading },
  } = useStore();

  const router = useRouter();

  const { t } = useTranslation("translations");
  
  return null;

  if (userLoading) {
    return (
      <li
        className={
          mobile
            ? "d-none d-lg-inline-block ms-3"
            : "d-block d-lg-none d-md-inline-block ms-3 mt-10"
        }
      >
        <Spinner />
      </li>
    );
  }

  return (
    <li
      className={
        mobile
          ? "d-none d-lg-inline-block ms-3"
          : "d-block d-lg-none d-md-inline-block ms-3 mt-10"
      }
    >
      {user !== null ? (
        <div className="d-flex align-items-center justify-center gap-3">
          <div
            className="avatar-container"
            onClick={() => router.push("/account")}
          >
            <Badge className="avatar-badge" bg="light" text="dark">
              {user.displayName[0]}
            </Badge>
            <img
              src={user.profileImage}
              alt={user.profileImage}
              className="avatar"
            />
          </div>
          <OverlayTrigger overlay={<Tooltip>{t('header.logout')}</Tooltip>}>
            <i
              onClick={logout}
              className="fa-solid fa-door-open logout-icon"
            ></i>
          </OverlayTrigger>
        </div>
      ) : (
        <button
          onClick={() => modalStore.setActiveModal(LOGIN_MODAL)}
          className="btn-fourteen"
        >
          <i className="fa-regular fa-lock"></i>{" "}
          <span>{t("account:authentication.login")}</span>
        </button>
      )}
    </li>
  );
};

export default observer(AuthButton);
