import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import icon_1 from "@/assets/images/dashboard/icon/icon_18.svg";
import icon_2 from "@/assets/images/dashboard/icon/icon_19.svg";
import icon_3 from "@/assets/images/dashboard/icon/icon_20.svg";
import icon_4 from "@/assets/images/dashboard/icon/icon_21.svg";

import listImg_5 from "@/assets/images/dashboard/img_05.jpg";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import ListingLoadingTable from "@/components/ui/loading/ListingLoadingTable";
import { useEffect } from "react";
import { useServer } from "@/hooks/useServer";

const PropertyTableBody = () => {
  const {
    propertyStore: {
      userPropertiesLoading,
      userProperties,
      setUserProperties,
      setUserPropertiesLoading,
      statusLabel,
    },
    userStore: { isAdmin },
  } = useStore();

  const { sendRequest } = useServer();

  const loadProperties = async () => {
    setUserPropertiesLoading(true);

    try {
      const response = await sendRequest(
        isAdmin ? "/property/list-extended" : "/property/list"
      );

      if (response?.status) {
        setUserProperties(response.data);
      }
    } catch (error) {
      console.error("Error loading properties:", error);
    }

    setUserPropertiesLoading(false);
  };

  useEffect(() => {
    loadProperties();
  }, []);

  if (userPropertiesLoading) {
    return <ListingLoadingTable />;
  }

  if (userProperties.length === 0) {
    return (
      <tbody>
        <tr className="w-100 text-center">
          <td colSpan={5}>
            <h6>No properties found</h6>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="border-0">
      {userProperties.map((item) => (
        <tr className="listing-table" key={item.id}>
          <td className="center">
            <div className="d-lg-flex align-items-center justify-content-center position-relative">
              <Image
                src={item.property_data.images.split(", ")[0]}
                width={200}
                height={200}
                alt="property-image"
                className="p-img"
              />
            </div>
          </td>
          <td className="center">
            {" "}
            <strong className="price color-dark">
              {item.property_data.city}
            </strong>
            <p className="price color-dark">{item.property_data.address}</p>
          </td>
          <td className="center">
            <p className="price color-dark">€{item.property_data.rent}</p>
          </td>
          <td className="center">
            <div
              className={`property-status ${statusLabel(
                item.status
              ).toLowerCase()}`}
            >
              {statusLabel(item.status)}
            </div>
          </td>
          {isAdmin ? (
            <td className="center">
              <div className="action-dots float-end">
                <button
                  className="action-btn dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span></span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" href="#">
                      <Image src={icon_1} alt="" className="lazy-img" /> View
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      <Image src={icon_2} alt="" className="lazy-img" /> Share
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      <Image src={icon_3} alt="" className="lazy-img" /> Edit
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      <Image src={icon_4} alt="" className="lazy-img" /> Delete
                    </Link>
                  </li>
                </ul>
              </div>
            </td>
          ) : (
            <td className="center"></td>
          )}
        </tr>
      ))}
    </tbody>
  );
};

export default observer(PropertyTableBody);
