export const ENV_PROD = process.env.NODE_ENV === "production";

// social
export const EMAIL = "info@domakin.nl";
export const PHONE_NUMBER = "+31 85 083 5000";
export const FACEBOOK =
  "https://www.facebook.com/profile.php?id=100093230497851";
export const INSTAGRAM = "https://www.instagram.com/domakin.nl/";
export const LINKEDIN = "https://www.linkedin.com/company/domakin/";

// team socials
export const TEAM_SOCIALS = [
  {
    instagram: "https://www.instagram.com/vdvends",
    linkedin: "https://www.linkedin.com/in/lazar-popov-bb4321200/",
  },
  {
    instagram: "https://www.instagram.com/n0t_stalking",
    linkedin: "https://www.linkedin.com/in/sava-popov-5a278b2a0/",
  },
  {
    instagram: "https://www.instagram.com/paolinagocheva",
    linkedin: "https://www.linkedin.com/in/paolina-gocheva-6b0711245/",
  },
  {
    instagram: "https://www.instagram.com/radost.lo",
    linkedin: "https://www.linkedin.com/in/radost-lozanova/",
  },
  {
    instagram: "https://www.instagram.com/marinovv24",
    linkedin: "https://www.linkedin.com/in/vladislav-marinov-122455208/",
  },
];

export const ADDRESS = "";
export const PHONE = "";

// status
export const STATUS_COLORS = {
  1: "bg-orange",
  2: "bg-green",
  3: "bg-red",
};
export const LANGUAGES = ["en", "bg", "gr"];

// prices
export const REFERRAL_BONUS_LISTING = 50;
export const REFERRAL_BONUS_OTHERS = 5;

export const VIEWING_STANDARD_PRICE = 50;
export const VIEWING_EXPRESS_PRICE = 100;
export const VIEWING_PREMIUM_PRICE = 100;


export const RENTING_COMMISSION = 200;

export const RENTING_PRICE_SUBRENT_DISCOUNT = 200;
export const DISCOUNTS = {
  subRent: RENTING_PRICE_SUBRENT_DISCOUNT,
};

// KVK
export const KVK = "90831268";

//views
export const LIST = "1";
export const GRID = "2";

//modals
export const COOKIE_MODAL = "COOKIE_MODAL";
export const LOGIN_MODAL = "LOGIN_MODAL";
export const EDIT_PROPERTY_MODAL = "EDIT_PROPERTY_MODAL";
export const LONG_LOADING_MODAL = "LONG_LOADING_MODAL";
export const PAYMENT_LINK_MODAL = "PAYMENT_LINK_MODAL";
export const APPLICATION_MODAL = "APPLICATION_MODAL";
export const APPLICATION_PREVIEW_MODAL = "APPLICATION_PREVIEW_MODAL";
export const PROMOTE_USERS_MODAL = "PROMOTE_USERS_MODAL";
export const REFERRAL_BONUS_EDIT_MODAL = "REFERRAL_BONUS_EDIT_MODAL";
export const REFERRAL_BONUS_PREVIEW_MODAL = "REFERRAL_BONUS_PREVIEW_MODAL";

export const REFERRAL_BONUS_STATUSES = [
  { value: 1, text: "Waiting Approval" },
  { value: 2, text: "Pending" },
  { value: 3, text: "Completed" },
  { value: 4, text: "Rejected" },
];

export const REFERRAL_BONUS_TYPES = [
  { value: 1, text: "Listing" },
  { value: 2, text: "Viewing" },
  { value: 3, text: "Renting" },
];

// local storage
export const LISTING_REFERENCE_ID = "listing_reference_id";

// tabs
export const FORGOTTEN_PASS = 2;
export const SIGN_UP = 1;
export const LOGIN_IN = 0;

//links
export const VIEWING_URL = process.env.NEXT_PUBLIC_URL + "/services/viewing";
export const RENTING_URL = process.env.NEXT_PUBLIC_URL + "/services/renting";
export const ADD_LISTING_URL =
  process.env.NEXT_PUBLIC_URL + "/services/add-listing";
export const SEARCH_RENTING =
  process.env.NEXT_PUBLIC_URL + "/services/room-searching";

export const PROPERTY_ID_OFFSET = 1000;

export const PROPERTY_STATUSES = [
  { value: 1, text: "Pending" },
  { value: 2, text: "Active" },
  { value: 3, text: "Taken" },
  { value: 4, text: 'Declined' }
];

export const APPLICATION_STATUSES = [
  { value: 1, text: "Pending" },
  { value: 2, text: "Contacted" },
  { value: 3, text: "Approved" },
  { value: 4, text: "Rejected" }
];

// Property type enum: DB value 1,2,3,4 → label (index = value)
const PROPERTY_TYPE_LABELS: readonly (string | undefined)[] = [
  undefined, // 0 unused
  "Room in a shared property",
  "Studio",
  "Apartment",
  "House",
];

/** Translation key for property type (use with t(): t(getPropertyTypeLabelKey(id))). */
export const getPropertyTypeLabelKey = (id: number): string =>
  `enums.property_type.${id}`;

/** Get display label for property type id from DB (1, 2, 3, 4). Fallback when no t(). */
export const getPropertyTypeLabel = (id: number): string =>
  PROPERTY_TYPE_LABELS[id] ?? `#${id}`;

/** Options for selects; derived from enum. */
export const PROPERTY_TYPES = PROPERTY_TYPE_LABELS.flatMap((text, value) =>
  value === 0 || text === undefined ? [] : [{ value, text }]
);

// Furnished type enum: DB value 1,2,3 → label (index = value)
const FURNISHED_TYPE_LABELS: readonly (string | undefined)[] = [
  undefined, // 0 unused
  "Fully furnished",
  "Semi-furnished",
  "None",
];

/** Translation key for furnished type (use with t(): t(getFurnishedTypeLabelKey(id))). */
export const getFurnishedTypeLabelKey = (id: number): string =>
  `enums.furnished_type.${id}`;

/** Get display label for furnished type id from DB (1, 2, 3). Fallback when no t(). */
export const getFurnishedTypeLabel = (id: number): string =>
  FURNISHED_TYPE_LABELS[id] ?? `#${id}`;

/** Options for selects; derived from enum. */
export const FURNISHED_TYPES = FURNISHED_TYPE_LABELS.flatMap((text, value) =>
  value === 0 || text === undefined ? [] : [{ value, text }]
);

// Amenities — single source of truth: id → { text, order }.
// - IDs must stay stable (DB).
// - Change `order` to reorder in UI without changing ids.
// - Add new amenities by adding a new id entry.
const AMENITIES: Record<number, { text: string; order: number }> = {
  1: { text: "Air Conditioning", order: 1 },
  2: { text: "Washing Machine", order: 2 },
  16: { text: "Dryer", order: 3 }, // placed after washing machine without changing existing ids
  3: { text: "Dishwasher", order: 4 },
  4: { text: "Microwave", order: 5 },
  5: { text: "Stove", order: 6 },
  6: { text: "Oven", order: 7 },
  7: { text: "Bike Space", order: 8 },
  8: { text: "Garage", order: 9 },
  9: { text: "Parking", order: 10 },
  10: { text: "Storage Space", order: 11 },
  11: { text: "Garden", order: 12 },
  12: { text: "Disabled Access", order: 13 },
  13: { text: "Wi-fi", order: 14 },
  14: { text: "BBQ", order: 15 },
  15: { text: "Balcony", order: 16 },
};

/** Translation key: t(getAmenityLabelKey(id)) */
export const getAmenityLabelKey = (id: number): string =>
  `enums.amenities.${id}`;

/** Fallback English label for amenity id. */
export const getAmenityLabel = (id: number): string =>
  AMENITIES[id]?.text ?? `#${id}`;

/** {id, text} options for checkboxes, in display order. */
export const AMENITY_OPTIONS = Object.entries(AMENITIES)
  .map(([id, { text, order }]) => ({ id: Number(id), text, order }))
  .sort((a, b) => a.order - b.order)
  .map(({ id, text }) => ({ id, text }));

// Shared space — single source of truth: id → { text, order } (same idea as amenities).
const SHARED_SPACE: Record<number, { text: string; order: number }> = {
  1: { text: "Balcony", order: 1 },
  2: { text: "Kitchen", order: 2 },
  3: { text: "Bathroom", order: 3 },
  4: { text: "Toilet", order: 4 },
  5: { text: "Storage space", order: 5 },
  6: { text: "Living room", order: 6 },
};

/** Translation key: t(getSharedSpaceLabelKey(id)) */
export const getSharedSpaceLabelKey = (id: number): string =>
  `enums.shared_space.${id}`;

/** Fallback English label for shared space id. */
export const getSharedSpaceLabel = (id: number): string =>
  SHARED_SPACE[id]?.text ?? `#${id}`;

/** {id, text} options for checkboxes, in display order. */
export const SHARED_SPACE_OPTIONS = Object.entries(SHARED_SPACE)
  .map(([id, { text, order }]) => ({ id: Number(id), text, order }))
  .sort((a, b) => a.order - b.order)
  .map(({ id, text }) => ({ id, text }));

/** Return translated label if key exists, otherwise fallback. Use: getTranslatedEnum(t, getXLabelKey(id), getXLabel(id)). */
export const getTranslatedEnum = (
  t: (key: string) => string,
  key: string,
  fallback: string
): string => {
  const translated = t(key);
  return translated !== key ? translated : fallback;
};

export const FCM_TOKEN_KEY = 'fcm_token_registered';
