// sorting

export const SORT_NEWEST = "1";
export const SORT_OLDEST = "2";
export const SORT_PRICE_LOW = "3";
export const SORT_PRICE_HIGH = "4";

export const PropertySort = [
  { value: "newest", text: "Newest" },
  { value: "best_seller", text: "Best Seller" },
  { value: "price_low", text: "Price Low" },
  { value: "price_high", text: "Price High" },
];

export const PROPERTY_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
  EXPIRED: 4,
  CANCELLED: 5,
  ON_HOLD: 6,
};
