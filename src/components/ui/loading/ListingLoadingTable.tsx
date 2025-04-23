import React from "react";
import Skeleton from "react-loading-skeleton";

const ListingLoadingTable = () => {
  return (
    <tbody>
      <tr className="w-100 text-center">
        <td colSpan={1}>
          <Skeleton height={100} width={100} />
        </td>

        <td colSpan={1}>
          <Skeleton height={20} width={200} />
          <Skeleton height={20} width={200} />
        </td>

        <td colSpan={1}>
          <Skeleton height={20} width={200} />
          <Skeleton height={20} width={50} />
        </td>

        <td colSpan={1}>
          <Skeleton height={20} width={200} />
          <Skeleton height={20} width={200} />
        </td>

        <td colSpan={1}>
          <Skeleton height={20} width={200} />
        </td>
      </tr>
    </tbody>
  );
};

export default ListingLoadingTable;
