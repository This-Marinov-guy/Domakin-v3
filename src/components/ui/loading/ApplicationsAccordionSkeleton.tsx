"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ApplicationsAccordionSkeleton = () => {
  return (
    <div className="accordion" id="applications-accordion-skeleton">
      <Skeleton height={50} width="100%" className="mb-3" />
      <Skeleton height={50} width="100%" className="mb-3" />
      <Skeleton height={50} width="100%" className="mb-3" />
    </div>
  );
};

export default ApplicationsAccordionSkeleton;
