import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/storeContext";
import { ENV_PROD, LOGIN_MODAL } from "@/utils/defines";
import { useRouter } from "next/router";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";
import useTranslation from "next-translate/useTranslation";
import LogoutButton from "./LogoutButton";

const AuthButton = ({
  responsive = false,
  mobile = false,
  withLogout = true,
}: any) => {
  const {
    modalStore,
    userStore: { user, logout, userLoading },
  } = useStore();

  const router = useRouter();

  const { t } = useTranslation("translations");

  if (userLoading) {
    return (
      <li
        className={
          responsive
            ? "d-inline-block ms-3"
            : mobile
            ? "d-block d-lg-none d-md-inline-block ms-3 mt-10"
            : "d-lg-inline-block ms-3"
        }
      >
        <Spinner size='sm' animation="border"/>
      </li>
    );
  }

  return (
    <li
      className={
        responsive
          ? "d-inline-block ms-3"
          : mobile
          ? "d-block d-lg-none d-md-inline-block ms-3 mt-10"
          : "d-lg-inline-block ms-3"
      }
    >
      {user !== null ? (
        <div className="d-flex align-items-center justify-center gap-3">
          <div
            className="avatar-container"
            onClick={() => router.push("/account")}
          >
            <Badge className="avatar-badge" bg="light" text="dark">
              {user.name[0]}
            </Badge>
            <img
              src={user.profileImage}
              alt={user.profileImage}
              className="avatar"
            />
          </div>
          {withLogout && <LogoutButton />}
        </div>
      ) : (
        <button
          onClick={() => {
            const query: Record<string, any> = { login: 1 };

            // Include 'slug' if it exists in the current route
            if (router.query.slug) {
              query.slug = router.query.slug;
            }

            router.push(
              {
                pathname: router.pathname,
                query,
              },
              undefined,
              { shallow: true }
            );
          }}
          className="btn-fourteen"
        >
          <>
            <i className="fa-regular fa-lock"></i>{" "}
            <span>{t("account:authentication.login")}</span>
          </>
        </button>
      )}
    </li>
  );
};

export default observer(AuthButton);
