"use client";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Image from "next/image";
import supabase from "@/utils/supabase";

import OpenEye from "@/assets/images/icon/icon_68.svg";
import { useServer } from "@/hooks/useServer";
import useTranslation from "next-translate/useTranslation";
import { toast } from "react-toastify";
import { useStore } from "@/stores/storeContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { showGeneralError, showStandardNotification } from "@/utils/helpers";

const defaultData = {
  email: "",
  password: "",
  keepLogged: true,
};

const LoginForm = () => {
  const { t } = useTranslation("account");

  const { modalStore } = useStore();

  const router = useRouter();

  const {
    commonStore: { loading, startLoading, stopLoading },
    userStore,
  } = useStore();

  const [form, setForm] = useState(defaultData);
  const [errors, setErrors] = useState<string[]>([]);
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  const handleChange = (e: any) => {
    setForm((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  // TODO: Implement the Forgotten Password function
  const handleChangePass = (e: any) => {
    toast.warning(
      "Changing password is currently not available - please contact support for help!",
      {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    );
  };

  const signInWithPassword = async (e: any) => {
    e.preventDefault();

    startLoading();
    setErrors([]);

    try {
      const {
        error,
        data: { session },
      } = await supabase.auth.signInWithPassword(form);

      if (error) {
        showStandardNotification(
          "error",
          t("authentication.errors.login_failed")
        );
        return setErrors(["email", "password"]);
      }

      await userStore.setUser(session);
      modalStore.closeAll();

      if (sessionStorage.getItem("redirect")) {
        router.push(sessionStorage.getItem("redirect") as string);
        sessionStorage.removeItem("redirect");
      } else {
        router.push("/account");
      }
    } catch (error) {
      showGeneralError(t("api.general_error"));
    } finally {
      stopLoading();
    }
  };

  return (
    <form>
      <div className="row">
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label htmlFor="">{t("authentication.email")}</label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => {
                handleChange(e);
              }}
              isInvalid={errors.includes("email")}
            />
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta position-relative mb-20">
            <label htmlFor="">{t("authentication.password")}</label>
            <Form.Control
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={(e) => {
                handleChange(e);
              }}
              isInvalid={errors.includes("password")}
            />
            <span className="placeholder_icon">
              <span
                className={`passVicon ${isPasswordVisible ? "eye-slash" : ""}`}
              >
                <Image
                  onClick={togglePasswordVisibility}
                  src={OpenEye}
                  alt=""
                />
              </span>
            </span>
          </div>
        </div>
        <div className="col-12">
          <div className="agreement-checkbox d-flex justify-content-between align-items-center">
            <div className="col-7 d-flex gap-3 align-items-center justify-content-start">
              <Form.Check
                type="checkbox"
                name="Amenities"
                checked={form.keepLogged}
                onChange={(e) => {
                  setForm((prevState) => {
                    return { ...prevState, keepLogged: e.target.checked };
                  });
                }}
              />
              <label>{t("authentication.keep_logged_in")}</label>
            </div>
            <Link href="#" onClick={handleChangePass}>
              {t("authentication.forgot_password")}
            </Link>
          </div>
        </div>
        <div className="col-12">
          <button
            type="submit"
            disabled={loading}
            onClick={signInWithPassword}
            className="btn-two w-100 text-uppercase d-block mt-20"
          >
            {loading ? <Spinner size='sm' animation="border"/> : t("authentication.log_in")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
