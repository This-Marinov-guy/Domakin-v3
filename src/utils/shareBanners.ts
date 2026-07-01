export const SITE_URL = "https://www.domakin.nl";

export const SHARE_BANNERS = {
  main: `${SITE_URL}/assets/img/banner/main-banner.png`,
  searching: `${SITE_URL}/assets/img/banner/searching-banner.png`,
  viewing: `${SITE_URL}/assets/img/banner/viewing-banner.png`,
  upload: `${SITE_URL}/assets/img/banner/upload-banner.png`,
  services: `${SITE_URL}/assets/img/banner/service-banner.png`,
} as const;

const normalizeSharePath = (path: string) =>
  (path || "/")
    .replace(/^\/[a-z]{2}(?=\/|$)/, "")
    .replace(/\?.*$/, "")
    .replace(/\/+$/, "")
    .replace(/^\//, "");

export const getShareBannerForPath = (path: string) => {
  const normalizedPath = normalizeSharePath(path);

  if (normalizedPath === "services/room-searching" || normalizedPath === "services/renting") {
    return SHARE_BANNERS.searching;
  }

  if (normalizedPath === "services/viewing") {
    return SHARE_BANNERS.viewing;
  }

  if (normalizedPath === "services/add-listing" || normalizedPath === "account/add-listing") {
    return SHARE_BANNERS.upload;
  }

  return SHARE_BANNERS.main;
};
