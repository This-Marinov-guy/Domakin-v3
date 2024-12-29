import React from "react";
import Skeleton from "react-loading-skeleton";

const ListingLoadingOne = ({ title }: { title: string }) => {
  return (
    <div className="mt-40 mb-40 container">
      <h3 className="text-center">{title}</h3>
      <div className="row">
        {/* For Large Screens */}
        <div className="col-lg-4 d-none d-lg-block">
          <Skeleton height={200} />
        </div>
        <div className="col-lg-4 d-none d-lg-block">
          <Skeleton height={200} />
        </div>
        <div className="col-lg-4 d-none d-lg-block">
          <Skeleton height={200} />
        </div>

        {/* For Medium Screens */}
        <div className="col-md-6 d-none d-md-block d-lg-none">
          <Skeleton height={200} />
        </div>
        <div className="col-md-6 d-none d-md-block d-lg-none">
          <Skeleton height={200} />
        </div>

        {/* For Small Screens */}
        <div className="col-12 d-md-none">
          <Skeleton height={200} />
        </div>
      </div>
    </div>
  );
};

export default ListingLoadingOne;
