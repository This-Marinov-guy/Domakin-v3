"use client";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Image from "next/image";

import OpenEye from "@/assets/images/icon/icon_68.svg";
import { useServer } from "@/hooks/useServer";
import useTranslation from "next-translate/useTranslation";
import { toast } from "react-toastify";
import { useStore } from "@/stores/storeContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const defaultData = {
  email: "",
  password: "",
  keepLogged: true,
};

const LoginForm = () => {
  const { t } = useTranslation("account");

  const { modalStore } = useStore();

  const router = useRouter();

  const { loading, sendRequest } = useServer();

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
    toast.warning("Changing password is currently not available - please contact support for help!", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    sendRequest("/login", "POST", form).then((res) => {
      if (res?.status) {
        setForm(defaultData);

        modalStore.closeAll();

        router.push("/account");

        toast.success("The property was uploaded successfully for approval", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (res?.invalid_fields) {
        setErrors(res.invalid_fields);
      }
    });
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
            <Link href="#" onClick={handleChangePass}>{t("authentication.forgot_password")}</Link>
          </div>
        </div>
        <div className="col-12">
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="btn-two w-100 text-uppercase d-block mt-20"
          >
            {loading ? <Spinner /> : t("authentication.log_in")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
