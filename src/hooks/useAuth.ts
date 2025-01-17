import useSWR from "swr";
import axios from "axios";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCookie } from "@/utils/helpers";

export const useAuth = ({ middleware, redirectIfAuthenticated }: any = {}) => {
  const router = useRouter();
  const params = useParams();

  const {
    data: user,
    error,
    mutate,
  } = useSWR("http://localhost:8000/api/user", () =>
    axios
      .get("http://localhost:8000/api/user")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;

        router.push("/verify-email");
      })
  );

  const csrf = () => {
    const sessionCookie = getCookie(process.env.NEXT_PUBLIC_SESSION_ID);

    if (sessionCookie) {
      return;
    }

    axios.get("http://localhost:8000/sanctum/csrf-cookie");
  };

  const register = async ({ setErrors, ...props }: any) => {
    await csrf();

    setErrors([]);

    axios
      .post("http://localhost:8000/register", props)
      .then(() => mutate())
      .catch((error) => {
        console.log(error);

        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const login = async ({ setErrors, setStatus, ...props }: any) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/login", props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const forgotPassword = async ({ setErrors, setStatus, email }: any) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/forgot-password", { email })
      .then((response) => setStatus(response.data.status))
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const resetPassword = async ({ setErrors, setStatus, ...props }: any) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/reset-password", { token: params.token, ...props })
      .then((response) =>
        router.push("/login?reset=" + btoa(response.data.status))
      )
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const resendEmailVerification = ({ setStatus }: any) => {
    axios
      .post("/email/verification-notification")
      .then((response) => setStatus(response.data.status));
  };

  const logout = async () => {
    if (!error) {
      await axios.post("/logout").then(() => mutate());
    }

    window.location.pathname = "/login";
  };

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated);

    if (middleware === "auth" && !user?.email_verified_at)
      router.push("/verify-email");

    if (window.location.pathname === "/verify-email" && user?.email_verified_at)
      router.push(redirectIfAuthenticated);
    if (middleware === "auth" && error) logout();
  }, [user, error]);

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  };
};
