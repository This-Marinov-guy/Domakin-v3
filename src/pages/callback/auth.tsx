import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { showGeneralError } from "@/utils/helpers";
import { useServer } from "@/hooks/useServer";
import useTranslation from "next-translate/useTranslation";
import { useStore } from "@/stores/storeContext";
import supabase from "@/utils/supabase";

export default function AuthCallback() {
  const {
    userStore: { user, setUser },
  } = useStore();
  const router = useRouter();
  const { sendRequest } = useServer();
  const { t } = useTranslation("account");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (session) {
          setUser(session);

          const responseData = await sendRequest("/register", "POST", {
            isSSO: true,
            id: session.user.id,
            name: session.user.user_metadata.full_name,
            email: session.user.user_metadata.email,
            phone: session.user.phone,
            profile_image: session.user.user_metadata.avatar_url,
          });
  
          if (responseData?.status) {
            router.push("/account");
          } else {
            showGeneralError(t("api.general_error"));
            return router.push("/");
          }
        } else if (error) {
          return showGeneralError(error?.message);
        }

      } catch (error) {
        router.push("/?error=auth");
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="mt-80 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h3>Completing authentication...</h3>
        <p>Please wait while we finish setting up your account.</p>
      </div>
    </div>
  );
}
