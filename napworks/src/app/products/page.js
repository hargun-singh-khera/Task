"use client";

import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DashboardShell, Icon } from "../components/DashboardShell";
import { deleteProduct, getProducts } from "@/services/product.service";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  FiSearch,
  FiFilter,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const PAGE_SIZE = 10;

const DEFAULT_FILTERS = {
  search: "",
  minPrice: "",
  maxPrice: "",
  startDate: "",
  endDate: "",
};

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  // Committed filters — only applied when user hits Apply / search
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  // ─── Fetch ──────────────────────────────────────────────────────────────────

  const fetchProducts = useCallback(async (page, activeFilters) => {
    try {
      setLoading(true);

      const params = { pageNumber: page, pageSize: PAGE_SIZE };
      Object.entries(activeFilters).forEach(([key, val]) => {
        if (val !== "") params[key] = val;
      });

      const response = await getProducts(params);

      setProducts(response.data ?? []);
      setTotalRecords(response.totalRecords ?? 0);
      setTotalPages(response.totalPages ?? 1);
      setPageNumber(response.pageNumber ?? page);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fire whenever appliedFilters or pageNumber change
  useEffect(() => {
    fetchProducts(pageNumber, appliedFilters);
  }, [pageNumber, appliedFilters, fetchProducts]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  // Debounce ref for search only
  const searchDebounceRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    // Update local display immediately
    setFilters((prev) => ({ ...prev, search: value }));

    // Debounce the API call by 500ms
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setPageNumber(1);
      setAppliedFilters((prev) => ({ ...prev, search: value }));
    }, 500);
  };

  // Cleanup debounce on unmount
  useEffect(() => () => clearTimeout(searchDebounceRef.current), []);

  // For date/price: update local state on change, commit to API only on blur
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterBlur = (e) => {
    const { name, value } = e.target;
    setPageNumber(1);
    setAppliedFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPageNumber(newPage);
  };

  // ─── Render helpers ──────────────────────────────────────────────────────────

  const startRecord = totalRecords === 0 ? 0 : (pageNumber - 1) * PAGE_SIZE + 1;
  const endRecord = Math.min(pageNumber * PAGE_SIZE, totalRecords);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteProduct(id);

      const isLastItemOnPage = products.length === 1;
      const shouldGoBack =
        isLastItemOnPage && pageNumber > 1;

      const nextPage = shouldGoBack
        ? pageNumber - 1
        : pageNumber;

      setPageNumber(nextPage);
      toast.success("Product Deleted Successfully");
      fetchProducts(nextPage, appliedFilters);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardShell>
      <Toaster position="bottom-right" />
      <div className="mx-auto max-w-[980px]">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Product</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#7c818a]">
            <Link href="/" className="hover:text-[#246bfe]">Dashboard</Link>
            <span>›</span>
            <span>Product</span>
            <span>›</span>
            <span className="font-semibold text-[#246bfe]">Sneakers</span>
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-[#d9dde3] bg-white p-5">
          <div className="flex flex-col gap-5">

            {/* Search + action bar */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <label className="relative w-full md:max-w-[445px]">
                <input
                  name="search"
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="h-10 w-full rounded-lg border border-[#aeb4bd] pl-4 pr-11 text-sm outline-none placeholder:text-[#8f949c] focus:border-[#246bfe] focus:ring-4 focus:ring-[#246bfe]/10"
                  placeholder="Search product"
                />
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-[#59606a]" />
              </label>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters((v) => !v)}
                  className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors ${showFilters
                    ? "border-[#246bfe] bg-[#246bfe]/10 text-[#246bfe]"
                    : "border-[#aeb4bd] bg-white text-[#383c45]"
                    }`}
                >
                  <FiFilter />
                  Filter
                </button>

                {/* New Product — useRouter navigation */}
                <button
                  onClick={() => router.push("/products/add")}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#246bfe] px-4 text-sm font-semibold text-white hover:bg-[#1a5ae8] transition-colors"
                >
                  New Product
                  <Icon name="plus" />
                </button>
              </div>
            </div>

            {/* Collapsible filter panel */}
            {showFilters && (
              <div className="grid gap-4 md:grid-cols-[1fr_1.25fr]">
                <div>
                  <p className="mb-2 text-sm font-semibold">Date Range</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      type="date"
                      name="startDate"
                      value={filters.startDate}
                      onChange={handleFilterChange}
                      onBlur={handleFilterBlur}
                      className="h-10 rounded-lg border border-[#c6cbd2] px-3 text-sm"
                      placeholder="Start Date"
                    />
                    <input
                      type="date"
                      name="endDate"
                      value={filters.endDate}
                      onChange={handleFilterChange}
                      onBlur={handleFilterBlur}
                      className="h-10 rounded-lg border border-[#c6cbd2] px-3 text-sm"
                      placeholder="End Date"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold">Price</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      onBlur={handleFilterBlur}
                      className="h-10 rounded-lg border border-[#c6cbd2] px-3 text-sm"
                      placeholder="Min Price"
                      min={0}
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      onBlur={handleFilterBlur}
                      className="h-10 rounded-lg border border-[#c6cbd2] px-3 text-sm"
                      placeholder="Max Price"
                      min={0}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="mt-5 overflow-x-auto rounded-2xl border border-[#d7dbe0]">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="bg-[#f8f8f9] text-left text-[#30333b]">
                  <th className="w-12 px-4 py-3">
                    <input type="checkbox" aria-label="Select all products" />
                  </th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 text-center font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // Skeleton rows
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-[#dfe2e6] animate-pulse">
                      <td className="px-4 py-3"><div className="h-4 w-4 rounded bg-[#e8eaed]" /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-[#e8eaed]" />
                          <div className="h-4 w-36 rounded bg-[#e8eaed]" />
                        </div>
                      </td>
                      <td className="px-4 py-3"><div className="h-4 w-16 rounded bg-[#e8eaed]" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-[#e8eaed]" /></td>
                      <td className="px-4 py-3 text-center"><div className="mx-auto h-4 w-4 rounded bg-[#e8eaed]" /></td>
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-[#7c818a]">
                      No products found. Try adjusting your filters.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="border-t border-[#dfe2e6] hover:bg-[#f8f9fb] transition-colors">
                      <td className="px-4 py-3">
                        <input type="checkbox" aria-label={`Select ${product.name}`} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product?.images?.[0]}
                            alt={product?.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <span className="whitespace-nowrap font-medium">{product?.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">${product?.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-[#59606a]">
                        {new Date(product?.createdAt).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "2-digit",
                        })}
                        <br />
                        <span className="text-xs">
                          at{" "}
                          {new Date(product?.createdAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="rounded-md p-1 text-[#59606a] hover:text-red-500 transition-colors"
                          aria-label={`Delete ${product.name}`}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-5 flex flex-col gap-3 text-sm text-[#383c45] sm:flex-row sm:items-center sm:justify-between">
            <p>
              {totalRecords === 0 ? (
                "No results"
              ) : (
                <>
                  <span className="font-semibold text-[#246bfe]">{startRecord}–{endRecord}</span>
                  {" "}of {totalRecords} products
                </>
              )}
            </p>

            <div className="flex items-center gap-3">
              <span className="text-[#7c818a]">Page</span>
              <select
                className="h-8 rounded-lg border border-[#bfc5ce] px-2"
                value={pageNumber}
                onChange={(e) => handlePageChange(Number(e.target.value))}
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <span className="text-[#7c818a]">of {totalPages}</span>

              <button
                onClick={() => handlePageChange(pageNumber - 1)}
                disabled={pageNumber <= 1}
                className="grid size-8 place-items-center rounded-lg border border-[#bfc5ce] disabled:opacity-40 hover:border-[#246bfe] hover:text-[#246bfe] transition-colors disabled:hover:border-[#bfc5ce] disabled:hover:text-inherit"
                aria-label="Previous page"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={() => handlePageChange(pageNumber + 1)}
                disabled={pageNumber >= totalPages}
                className="grid size-8 place-items-center rounded-lg border border-[#bfc5ce] disabled:opacity-40 hover:border-[#246bfe] hover:text-[#246bfe] transition-colors disabled:hover:border-[#bfc5ce] disabled:hover:text-inherit"
                aria-label="Next page"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}