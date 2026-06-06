import styles from "./Pagination.module.css";

function getPageItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pageSet = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  const pages = Array.from(pageSet)
    .filter((page) => page > 0 && page <= totalPages)
    .sort((a, b) => a - b);

  const items = [];
  let previousPage = 0;

  pages.forEach((page) => {
    if (page - previousPage > 1) {
      items.push("ellipsis-" + page);
    }

    items.push(page);
    previousPage = page;
  });

  return items;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  itemLabel,
  itemLabelSingular,
  className = "",
}) {
  if (!totalItems) {
    return null;
  }

  const visiblePages = getPageItems(currentPage, totalPages);
  const label = totalItems === 1 ? itemLabelSingular || itemLabel : itemLabel;

  return (
    <nav className={`${styles.pagination} ${className}`} aria-label={`${label} pagination`}>
      {totalPages > 1 ? (
        <div className={styles.controls}>
          <button
            className={styles.pageButton}
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label={`Previous ${label} page`}
          >
            Previous
          </button>

          <div className={styles.pageList}>
            {visiblePages.map((pageItem) =>
              typeof pageItem === "number" ? (
                <button
                  key={pageItem}
                  className={`${styles.pageButton} ${
                    pageItem === currentPage ? styles.pageButtonActive : ""
                  }`}
                  type="button"
                  onClick={() => onPageChange(pageItem)}
                  aria-current={pageItem === currentPage ? "page" : undefined}
                  aria-label={`Go to ${label} page ${pageItem}`}
                >
                  {pageItem}
                </button>
              ) : (
                <span key={pageItem} className={styles.ellipsis} aria-hidden="true">
                  ...
                </span>
              ),
            )}
          </div>

          <button
            className={styles.pageButton}
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label={`Next ${label} page`}
          >
            Next
          </button>
        </div>
      ) : null}
    </nav>
  );
}
