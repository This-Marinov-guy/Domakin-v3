import React from "react";
import Skeleton from "react-loading-skeleton";

const BlogLoadingSection = ({ title }: { title: string }) => {
  return (
    <div className="mt-40 mb-40 container">
      <h4 className="text-center">{title}</h4>
      <div className="row mb-30">
        <div className="col-lg-4">
          <Skeleton height={200} />
        </div>
        <div className="col-lg-4">
          <Skeleton height={20} />
          <Skeleton height={20} width={120} />
          <Skeleton height={20} width={120} />
          <Skeleton height={20} width={100} />
        </div>
      </div>
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

export default BlogLoadingSection;
