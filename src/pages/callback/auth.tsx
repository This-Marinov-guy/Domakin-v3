import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { showGeneralError } from "@/utils/helpers";
import { useServer } from "@/hooks/useServer";
import useTranslation from "next-translate/useTranslation";
import { useStore } from "@/stores/storeContext";
import supabase from "@/utils/supabase";

export default function AuthCallback() {
  const {
    userStore: { setUser },
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
          const provider = session.user.app_metadata?.provider;
          const meta = session.user.user_metadata ?? {};
          const identityMeta = session.user.identities?.[0]?.identity_data ?? {};

          let name: string;
          let surname: string;

          if (provider === "google") {
            name = meta.given_name || identityMeta.given_name || "";
            surname = meta.family_name || identityMeta.family_name || "";
          } else {
            const fullName = (meta.full_name || meta.name || identityMeta.full_name || identityMeta.name || "").trim();
            const parts = fullName.split(/\s+/);
            name = parts[0] || "";
            surname = parts.slice(1).join(" ") || "";
          }

          if (!name) {
            showGeneralError(t("api.general_error"));
            await supabase.auth.signOut();
            return router.push("/");
          }

          const responseData = await sendRequest(
            "/authentication/register",
            "POST",
            {
              isSSO: true,
              id: session.user.id,
              name,
              surname,
              email: meta.email,
              phone: session.user.phone,
              profile_image: meta.picture ?? meta.avatar_url ?? null,
            }
          );

          await setUser(session);

          if (responseData?.status && sessionStorage.getItem("redirect")) {
            router.push(sessionStorage.getItem("redirect") as string);
            sessionStorage.removeItem("redirect");
          } else if (responseData?.status) {
            router.push("/account");
          } else {
            await supabase.auth.signOut();
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
