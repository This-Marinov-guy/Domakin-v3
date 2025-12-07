"use client";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Image from "next/image";

import OpenEye from "@/assets/images/icon/icon_68.svg";
import { useServer } from "@/hooks/useServer";
import useTranslation from "next-translate/useTranslation";
import PrefixPhoneInput from "../ui/inputs/phone/PrefixPhoneInput";
import Trans from "next-translate/Trans";
import { useStore } from "@/stores/storeContext";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabase";
import { showGeneralError, showStandardNotification } from "@/utils/helpers";

const defaultData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  password_confirmation: "",
  terms: false,
};

const RegisterForm = () => {
  const { t } = useTranslation("account");

  const { modalStore, userStore } = useStore();

  const router = useRouter();

  const { sendRequest } = useServer();

  const [loading, setLoading] = useState(false);
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

  const signUpWithPassword = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validateResponse = await sendRequest(
        "/authentication/validate-credentials",
        "POST",
        form
      );

      if (validateResponse?.invalid_fields) {
        setErrors(validateResponse.invalid_fields);
      }

      if (!validateResponse?.status) {
        return;
      }

      const { data: {session, user}, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        phone: form.phone,
        options: {
          data: { display_name: `${form.firstName} ${form.lastName}`.trim() },
        },
      });

      if (error) {
        return showGeneralError(t("api.general_error"));
      }

      const responseData = await sendRequest("/authentication/register", "POST", {
        isSSO: false,
        id: `${user!.id ?? null}`,
        ...form,
      });

      if (responseData?.status) {
        await userStore.setUser(session);
        modalStore.closeAll();
        router.push("/account");
      } else if (responseData?.invalid_fields) {
        setErrors(responseData.invalid_fields);
      }
    } catch (error) {
      showGeneralError(t("api.general_error"));
    } finally {
      setLoading(false);
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

        <div className="col-lg-6 col-md-6 col-12">
          <div className="input-group-meta position-relative mb-25">
            <label htmlFor="">{t("authentication.first_name")}</label>
            <Form.Control
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={(e) => {
                handleChange(e);
              }}
              isInvalid={errors.includes("firstName")}
            />
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-12">
          <div className="input-group-meta position-relative mb-25">
            <label htmlFor="">{t("authentication.last_name")}</label>
            <Form.Control
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={(e) => {
                handleChange(e);
              }}
              isInvalid={errors.includes("lastName")}
            />
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-12">
          <div className="input-group-meta position-relative mb-25">
            <label htmlFor="">{t("authentication.phone")}</label>
            <PrefixPhoneInput
              value={form.phone}
              onChange={(value: string) => {
                setForm((prevState) => {
                  return { ...prevState, phone: value };
                });
              }}
              isInvalid={errors.includes("phone")}
            />
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-12">
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

        <div className="col-lg-6 col-md-6 col-12">
          <div className="input-group-meta position-relative mb-20">
            <label htmlFor="">{t("authentication.confirm_password")}</label>
            <Form.Control
              type={isPasswordVisible ? "text" : "password"}
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={(e) => {
                handleChange(e);
              }}
              isInvalid={errors.includes("password_confirmation")}
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

        <div className="col-12 mb-20 d-flex gap-3 align-items-center justify-content-start">
          <Form.Check
            type="checkbox"
            name="Amenities"
            checked={form.terms}
            onChange={(e) => {
              setForm((prevState) => {
                return { ...prevState, terms: e.target.checked };
              });
            }}
            isInvalid={errors.includes("terms")}
          />
          <label>
            <Trans
              i18nKey="account:authentication.terms"
              components={{
                link: (
                  <a href="/terms&policy" target="_blank" rel="noreferrer"></a>
                ),
              }}
            />
          </label>
        </div>

        <div className="col-12">
          <button
            type="submit"
            disabled={loading}
            onClick={signUpWithPassword}
            className="btn-two w-100 text-uppercase d-block mt-20"
          >
            {loading ? <Spinner size='sm' animation="border"/> : t("authentication.sign_up")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
