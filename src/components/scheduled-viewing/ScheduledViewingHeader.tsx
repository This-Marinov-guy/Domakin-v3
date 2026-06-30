import { useStore } from "@/stores/storeContext";
import { LOGIN_MODAL } from "@/utils/defines";
import { rememberAuthRedirect } from "@/utils/authRedirect";
import { logoByTheme } from "@/utils/config";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "react-bootstrap/Spinner";

const ScheduledViewingHeader = () => {
  const [accountOpen, setAccountOpen] = useState(false);
  const router = useRouter();
  const {
    modalStore,
    userStore: { user, userLoading, logout },
  } = useStore();

  const openLogin = () => {
    rememberAuthRedirect();
    const query = { ...router.query, login: 1 };

    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
    modalStore.setActiveModal(LOGIN_MODAL);
  };

  const goToAccount = () => {
    setAccountOpen(false);
    router.push("/account");
  };

  const handleLogout = async () => {
    setAccountOpen(false);
    await logout();
  };

  const initial = String(user?.name || user?.email || "A").charAt(0).toUpperCase();

  return (
    <header className="viewing-approval-header">
      <div className="viewing-approval-header__inner">
        <Link href="/" className="viewing-approval-header__logo" scroll={false}>
          <Image className="round-logo" src={logoByTheme()} alt="Domakin" />
        </Link>
        <nav aria-label="Viewing approval navigation">
          <Link href="/about" scroll={false}>About</Link>
          <Link href="/contact" scroll={false}>Contact</Link>
          {userLoading ? (
            <span className="viewing-approval-auth-loading">
              <Spinner size="sm" animation="border" />
            </span>
          ) : user?.email ? (
            <div className="viewing-approval-account">
              <button
                aria-expanded={accountOpen}
                aria-label="Account menu"
                className="viewing-approval-account__button"
                onClick={() => setAccountOpen((current) => !current)}
                type="button"
              >
                <i aria-hidden="true" className="bi bi-person-circle" />
                <span>{initial}</span>
              </button>
              {accountOpen && (
                <div className="viewing-approval-account__menu">
                  <button onClick={goToAccount} type="button">Go to account</button>
                  <button onClick={handleLogout} type="button">Log out</button>
                </div>
              )}
            </div>
          ) : (
            <button className="viewing-approval-login" onClick={openLogin} type="button">
              <i aria-hidden="true" className="fa-regular fa-lock" />
              <span>Login</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default observer(ScheduledViewingHeader);
