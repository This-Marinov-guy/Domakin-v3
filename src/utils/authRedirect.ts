export const cleanAuthRedirectPath = (href?: string) => {
  if (typeof window === "undefined") return "/";

  const url = new URL(href || window.location.href);
  url.searchParams.delete("login");
  url.searchParams.delete("signup");

  return `${url.pathname}${url.search}${url.hash}`;
};

export const rememberAuthRedirect = (href?: string) => {
  if (typeof window === "undefined") return;

  sessionStorage.setItem("redirect", cleanAuthRedirectPath(href));
};
