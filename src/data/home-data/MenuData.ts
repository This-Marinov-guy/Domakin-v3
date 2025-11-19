interface MenuItem {
    id: number;
    title: string;
    class_name?:string;
    link: string;
    has_dropdown: boolean;
    sub_menus?: {
        link: string;
        title: string;
    }[];
    menu_column?: {
        id: number;
        mega_title: string;
        mega_menus: {
            link: string;
            title: string;
        }[];
    }[]
}[];

const menu_data: MenuItem[] = [
  {
    id: 3,
    has_dropdown: true,
    title: "header.services",
    link: "#",
    class_name: "mega-dropdown-sm",
    menu_column: [
      {
        id: 1,
        mega_title: "features.viewings",
        mega_menus: [{ link: "/services/viewing", title: "features.viewings" }],
      },
      {
        id: 2,
        mega_title: "footer.renting",
        mega_menus: [
          { link: "/services/renting", title: "features.rent_an_apartment" },
          {
            link: "/services/room-searching",
            title: "features.room_searching",
          },
          // {
          //   link: "/services/emergency-housing",
          //   title: "features.emergency_housing",
          // },
        ],
      },
      {
        id: 3,
        mega_title: "footer.lending",
        mega_menus: [
          { link: "/services/add-listing", title: "features.list_a_room" },
          // {
          //   link: "/services/emergency-housing",
          //   title: "features.emergency_housing",
          // },
        ],
      },
    ],
  },
  {
    id: 2,
    has_dropdown: true,
    title: "header.about",
    link: "#",
    sub_menus: [
      { link: "/about", title: "header.legacy" },
      { link: "/agents", title: "header.agents" },
    ],
  },
  // {
  //   id: 4,
  //   has_dropdown: false,
  //   title: "header.recommendations",
  //   link: "/our-recommendations",
  // // },
  // {
  //   id: 5,
  //   has_dropdown: false,
  //   title: "footer.support",
  //   link: "/support-us",
  // },
  {
    id: 6,
    has_dropdown: false,
    title: "header.pricing",
    link: "/pricing",
  },
  {
    id: 7,
    has_dropdown: false,
    title: "blog.title",
    link: "/blog",
  },
  {
    id: 8,
    has_dropdown: false,
    title: "careers.title",
    link: "/careers",
  },
  {
    id: 9,
    has_dropdown: false,
    title: "header.contact",
    link: "/contact",
  },
];
export default menu_data;

// NOTE: leave for template
// class_name: "mega-dropdown-sm",
// menu_column: [
    //   {
    //     id: 1,
    //     mega_title: "features.viewings",
    //     mega_menus: [{ link: "/services/viewing", title: "features.viewings" }],
    //   },
    //   {
    //     id: 2,
    //     mega_title: "footer.renting",
    //     mega_menus: [
    //       { link: "/services/renting", title: "features.rent_an_apartment" },
    //       // {
    //       //   link: "/services/emergency-housing",
    //       //   title: "features.emergency_housing",
    //       // },
    //     ],
    //   },
    //   {
    //     id: 3,
    //     mega_title: "footer.lending",
    //     mega_menus: [
    //       { link: "/services/add-listing", title: "footer.lending" },
    //       // {
    //       //   link: "/services/emergency-housing",
    //       //   title: "features.emergency_housing",
    //       // },
    //     ],
    //   },
    // ],