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

// Property listing types (matches propertyStore / list-room form)
export const PROPERTY_TYPES = [
  { value: 1, text: "Room in a shared apartment" },
  { value: 2, text: "Studio" },
  { value: 3, text: "Entire place" },
  { value: 4, text: "Student house" },
];

export const FURNISHED_TYPES = [
  { value: 1, text: "Fully furnished" },
  { value: 2, text: "Semi-furnished" },
  { value: 3, text: "None" },
];

/**
 * Amenities enum: index = value stored in DB, string = label shown to client.
 * Use AMENITIES_LIST[id] to get label for a given id.
 */
export const AMENITIES_LIST: readonly string[] = [
  "A/C & Heating",
  "Garages",
  "Swimming Pool",
  "Parking",
  "Lake View",
  "Garden",
  "Disabled Access",
  "Pet Friendly",
  "Ceiling Height",
  "Outdoor Shower",
  "Refrigerator",
  "Fireplace",
  "Wifi",
  "TV Cable",
  "Barbeque",
  "Laundry",
  "Dryer",
  "Lawn",
  "Elevator",
];

/** Get display label for an amenity id (number from DB). */
export const getAmenityLabel = (id: number): string =>
  AMENITIES_LIST[id] ?? `#${id}`;