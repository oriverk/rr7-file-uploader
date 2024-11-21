import { useMemo, useState } from "react";

/**
 * @param totalItems
 * @param itemsPerPage
 * @param initialPage 1 <= initialPage
 * @returns
 */
export function usePagination<T>(
	totalItems: T[],
	itemsPerPage: number,
	initialPage = 1,
) {
	const [currentPage, setCurrentPage] = useState(initialPage);

	const totalPages = useMemo(
		() => Math.ceil(totalItems.length / itemsPerPage),
		[itemsPerPage, totalItems.length],
	);

	const goToPage = (page: number) => {
		const pageNumber = Math.max(1, Math.min(page, totalPages));
		setCurrentPage(pageNumber);
	};

	const nextPage = () => {
		goToPage(currentPage + 1);
	};

	const prevPage = () => {
		goToPage(currentPage - 1);
	};

	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentItems = totalItems.slice(startIndex, endIndex);

	return {
		currentPage,
		totalPages,
		startIndex,
		endIndex,
		currentItems,
		goToPage,
		nextPage,
		prevPage,
	};
}
