import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import styles from "./PaginatedTableWrapper.module.css";

interface PaginationInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface PaginatedTableWrapperProps<T> {
  fetchData: (page: number, perPage: number) => Promise<{ data: T[]; pagination: PaginationInfo }>;
  renderRows: (data: T[]) => React.ReactNode;
  initialPerPage?: number;
}

function PaginatedTableWrapper<T>({
  fetchData,
  renderRows,
  initialPerPage = 10,
}: PaginatedTableWrapperProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [perPage, setPerPage] = useState(initialPerPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = async (page = 0, perPageValue = perPage) => {
    setLoading(true);
    try {
      const result = await fetchData(page + 1, perPageValue); // API is 1-based
      setData(result.data);
      setCurrentPage((result.pagination.current_page || 1) - 1);
      setTotalPages(result.pagination.last_page || 1);
      setPerPage(result.pagination.per_page || initialPerPage);
    } catch (e) {
      setData([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    load(currentPage, perPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, perPage]);

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  return (
    <>
      {loading ? (
        <tr>
          <td colSpan={10} className="text-center">
            Loading...
          </td>
        </tr>
      ) : data.length === 0 ? (
        <tr>
          <td colSpan={10} className="text-center">
            No data found
          </td>
        </tr>
      ) : (
        renderRows(data)
      )}
      <tr
        className="pt-50 m-auto d-flex justify-content-center text-center align-items-center"
        style={{ gap: 12 }}
      >
        <td colSpan={10}>

        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={styles.pagination}
          activeClassName={"active"}
          forcePage={currentPage}
        />

        <select
          className={styles.perPageSelect}
          value={perPage}
          onChange={handlePerPageChange}
        >
          {[2, 5, 10, 20, 50].map((num) => (
            <option key={num} value={num}>
              {num} / page
            </option>
          ))}
        </select>
        </td>
      </tr>
    </>
  );
}

export default PaginatedTableWrapper; 