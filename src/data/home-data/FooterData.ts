interface DataType {
  id: number;
  page: string;
  widget_title: string;
  widget_class?: string;
  widget_class2?: string;
  footer_link: {
    link: string;
    link_title: string;
  }[];
}

const footer_data: DataType[] = [
  {
    id: 1,
    page: "home_1",
    widget_class: "xs-mt-50",
    widget_title: "Links",
    footer_link: [
      { link: "/", link_title: "Home" },
      { link: "/dashboard/membership", link_title: "Membership" },
      { link: "/about_us_01", link_title: "About Company" },
      { link: "/blog_01", link_title: "Blog" },
      { link: "/blog_02", link_title: "Explore Careers" },
      { link: "/pricing_02", link_title: "Pricing" },
      { link: "/dashboard/dashboard-index", link_title: "Dashboard" },
    ],
  },
  {
    id: 2,
    widget_class: "xs-mt-30",
    page: "home_1",
    widget_title: "Legal",
    footer_link: [
      { link: "/faq", link_title: "Terms & conditions" },
      { link: "/faq", link_title: "Cookie" },
      { link: "/faq", link_title: "Privacy policy" },
      { link: "/faq", link_title: "Faq’s" },
    ],
  },
  {
    id: 3,
    widget_class: "xs-mt-30",
    page: "home_1",
    widget_title: "New Listing",
    footer_link: [
      { link: "/listing_01", link_title: "​Buy Apartments" },
      { link: "/listing_02", link_title: "Buy Condos" },
      { link: "listing_03", link_title: "Rent Houses" },
      { link: "listing_04", link_title: "Rent Industrial" },
      { link: "/listing_05", link_title: "Buy Villas" },
      { link: "/listing_06", link_title: "Rent Office" },
    ],
  },

  // home two

  {
    id: 1,
    page: "home_3",
    widget_title: "Links",
    footer_link: [
      { link: "/", link_title: "Home" },
      { link: "/dashboard/membership", link_title: "Membership" },
      { link: "/about_us_01", link_title: "About Company" },
      { link: "/blog_01", link_title: "Blog" },
      { link: "/blog_02", link_title: "Explore Careers" },
      { link: "/pricing_02", link_title: "Pricing" },
      { link: "/dashboard/dashboard-index", link_title: "Dashboard" },
    ],
  },
  {
    id: 2,
    widget_class: "col-xxl-3 col-xl-4",
    page: "home_3",
    widget_title: "Legal",
    footer_link: [
      { link: "/faq", link_title: "Terms & conditions" },
      { link: "/faq", link_title: "Cookie" },
      { link: "/faq", link_title: "Privacy policy" },
      { link: "/faq", link_title: "Faq’s" },
    ],
  },
  {
    id: 3,
    page: "home_3",
    widget_title: "New Listing",
    footer_link: [
      { link: "/listing_01", link_title: "​Buy Apartments" },
      { link: "/listing_02", link_title: "Buy Condos" },
      { link: "listing_03", link_title: "Rent Houses" },
      { link: "listing_04", link_title: "Rent Industrial" },
      { link: "/listing_05", link_title: "Buy Villas" },
      { link: "/listing_06", link_title: "Rent Office" },
    ],
  },

  // home four

  {
    id: 1,
    page: "home_4",
    widget_class: "col-lg-2",
    widget_title: "footer.company",
    footer_link: [
      { link: "/about", link_title: "footer.about_us" },
      { link: "/agents", link_title: "footer.team" },
      { link: "/blog", link_title: "blog.title" },
      { link: "/careers", link_title: "careers.title" },
      { link: "/support-us", link_title: "footer.support" },
    ],
  },
  {
    id: 2,
    widget_class: "col-xl-2 col-lg-3",
    page: "home_4",
    widget_title: "footer.services",
    footer_link: [
      { link: "/services/viewing", link_title: "footer.viewings" },
      { link: "/services/renting", link_title: "features.rent_an_apartment" },
      {
        link: "/services/room-searching",
        link_title: "features.room_searching",
      },
      { link: "/services/add-listing", link_title: "footer.lending" },
      { link: "/pricing", link_title: "header.pricing" },
    ],
  },
  {
    id: 3,
    widget_class: "col-xl-2 col-lg-3",
    page: "home_4",
    widget_title: "footer.support",
    footer_link: [
      { link: "/contact", link_title: "footer.contact_us" },
      // { link: "/our-recommendations", link_title: "footer.recommendations" },
      { link: "/terms&policy", link_title: "footer.terms_policy" },
    ],
  },

  // home five

  {
    id: 1,
    page: "home_5",
    widget_class: "col-lg-3 ms-auto",
    widget_class2: "ps-xl-5",
    widget_title: "Links",
    footer_link: [
      { link: "/", link_title: "Home" },
      { link: "/dashboard/membership", link_title: "Membership" },
      { link: "/about_us_01", link_title: "About Company" },
      { link: "/blog_01", link_title: "Blog" },
      { link: "/blog_02", link_title: "Explore Careers" },
      { link: "/pricing_02", link_title: "Pricing" },
      { link: "/dashboard/dashboard-index", link_title: "Dashboard" },
    ],
  },
  {
    id: 2,
    widget_class: "col-lg-3",
    page: "home_5",
    widget_title: "Legal",
    footer_link: [
      { link: "/faq", link_title: "Terms & conditions" },
      { link: "/faq", link_title: "Cookie" },
      { link: "/faq", link_title: "Privacy policy" },
      { link: "/faq", link_title: "Faq’s" },
    ],
  },
  {
    id: 3,
    widget_class: "col-lg-2",
    page: "home_5",
    widget_title: "New Listing",
    footer_link: [
      { link: "/listing_01", link_title: "​Buy Apartments" },
      { link: "/listing_02", link_title: "Buy Condos" },
      { link: "listing_03", link_title: "Rent Houses" },
      { link: "listing_04", link_title: "Rent Industrial" },
      { link: "/listing_05", link_title: "Buy Villas" },
      { link: "/listing_06", link_title: "Rent Office" },
    ],
  },
];

export default footer_data;
