import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import ReactPaginate from "react-paginate";
import styles from "./PaginatedTableWrapper.module.css";
import { PAGINATION_PER_PAGE_OPTIONS_1, PAGINATION_PER_PAGE_OPTIONS_2 } from "@/utils/config";

const LOCAL_STORAGE_PER_PAGE_DEFAULT = "property_per_page_default";
const LOCAL_STORAGE_PER_PAGE_EXTENDED = "property_per_page_extended";

interface PaginationInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedTableWrapperHandle {
  reload: () => void;
}

interface PaginatedTableWrapperProps<T> {
  fetchData: (
    page: number,
    perPage: number
  ) => Promise<{ data: T[]; pagination: PaginationInfo }>;
  renderRows: (data: T[]) => React.ReactNode;
  initialPerPage?: number;
  perPageOptionsType?: 'default' | 'extended';
  perPageOptions?: number[];
  /** When this changes, we load page 0 once (e.g. filter signature). Prevents remount + multiple requests. */
  filterKey?: string;
  /** When false, do not run load effect (e.g. until parent has initialized from URL). Default true. */
  loadEnabled?: boolean;
}

const PaginatedTableWrapper = forwardRef(function PaginatedTableWrapper<T>(
  {
    fetchData,
    renderRows,
    initialPerPage = 10,
    perPageOptionsType = 'default',
    perPageOptions,
    filterKey = "",
    loadEnabled = true,
  }: PaginatedTableWrapperProps<T>,
  ref: React.Ref<PaginatedTableWrapperHandle>
) {
  const options =
    perPageOptions ||
    (perPageOptionsType === "extended"
      ? PAGINATION_PER_PAGE_OPTIONS_2
      : PAGINATION_PER_PAGE_OPTIONS_1);
  const localStorageKey = perPageOptionsType === 'extended' ? LOCAL_STORAGE_PER_PAGE_EXTENDED : LOCAL_STORAGE_PER_PAGE_DEFAULT;

  // Read perPage from localStorage or use initialPerPage
  const getInitialPerPage = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(localStorageKey);
      if (stored && !isNaN(Number(stored))) {
        return Number(stored);
      }
    }
    return initialPerPage;
  };

  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [perPage, setPerPage] = useState(getInitialPerPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const prevFilterKeyRef = useRef(filterKey);
  const skipNextLoadRef = useRef(false);

  const load = async (page = currentPage, perPageValue = perPage) => {
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

  // Expose reload method to parent
  useImperativeHandle(ref, () => ({
    reload: () => {
      load();
    },
  }));

  useEffect(() => {
    if (!loadEnabled) return;
    if (skipNextLoadRef.current) {
      skipNextLoadRef.current = false;
      return;
    }
    const filterKeyChanged = prevFilterKeyRef.current !== filterKey;
    if (filterKeyChanged) {
      prevFilterKeyRef.current = filterKey;
      setCurrentPage(0);
      skipNextLoadRef.current = true;
      load(0, perPage);
      return;
    }
    load(currentPage, perPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadEnabled, filterKey, currentPage, perPage]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(localStorageKey, String(perPage));
    }
  }, [perPage, localStorageKey]);

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setPerPage(value);
    setCurrentPage(0);
    if (typeof window !== "undefined") {
      localStorage.setItem(localStorageKey, String(value));
    }
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
      {!loading && (
        <tr>
          <td colSpan={10}>
            <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-3 mt-4">
              <ReactPaginate
                breakLabel="..."
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={totalPages}
                renderOnZeroPageCount={null}
                className="pagination-two d-inline-flex align-items-center justify-content-center style-none"
                previousLabel={<i className="fa-regular fa-chevron-left"></i>}
                nextLabel={<i className="fa-regular fa-chevron-right"></i>}
                forcePage={currentPage}
              />
              <select
                className={styles.perPageSelect + " mt-2"}
                value={perPage}
                onChange={handlePerPageChange}
              >
                {options.map((num) => (
                  <option key={num} value={num}>
                    {num} per page
                  </option>
                ))}
              </select>
            </div>
          </td>
        </tr>
      )}
    </>
  );
});

export default PaginatedTableWrapper;
