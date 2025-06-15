"use client";
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import NiceSelect from "@/ui/NiceSelect";
import PropertyTableBody from "./PropertyTableBody";
import Link from "next/link";
import Image from "next/image";

import icon_1 from "@/assets/images/icon/icon_46.svg";

const PropertyListBody = () => {
  const selectHandler = (e: any) => {};

  return (
    <>
      {/* <div className="d-sm-flex align-items-center justify-content-between mb-25">
        <div className="fs-16">
          Showing <span className="color-dark fw-500">1–5</span> of{" "}
          <span className="color-dark fw-500">40</span> results
        </div>
        <div className="d-flex ms-auto xs-mt-30">
          <div className="short-filter d-flex align-items-center ms-sm-auto">
            <div className="fs-16 me-2">Short by:</div>
            <NiceSelect
              className="nice-select"
              options={[
                { value: "1", text: "Newest" },
                { value: "2", text: "Best Seller" },
                { value: "3", text: "Best Match" },
                { value: "4", text: "Price Low" },
                { value: "5", text: "Price High" },
              ]}
              defaultCurrent={0}
              onChange={selectHandler}
              name=""
              placeholder=""
            />
          </div>
        </div>
      </div> */}

      <div className="bg-white card-box p0 border-20">
        <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
          <table className="table property-list-table">
            <thead>
              <tr>
                <th className="text-center w-25 responsive-title-col" style={{width: '25%'}} scope="col">Title</th>
                <th className="text-center" scope="col">Location</th>
                <th className="text-center" scope="col">Rent</th>
                <th className="text-center" scope="col">Status</th>
                <th className="text-center" scope="col">Action</th>
              </tr>
            </thead>
            <PropertyTableBody />
          </table>
        </div>
      </div>

      {/* <ul className="pagination-one d-flex align-items-center justify-content-center style-none pt-40">
        <li className="me-3">
          <Link href="#">1</Link>
        </li>
        <li className="selected">
          <Link href="#">2</Link>
        </li>
        <li>
          <Link href="#">3</Link>
        </li>
        <li>
          <Link href="#">4</Link>
        </li>
        <li>....</li>
        <li className="ms-2">
          <Link href="#" className="d-flex align-items-center">
            Last <Image src={icon_1} alt="" className="ms-2" />
          </Link>
        </li>
      </ul> */}
    </>
  );
};

export default PropertyListBody;
