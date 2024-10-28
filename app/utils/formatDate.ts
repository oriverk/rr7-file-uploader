import { format } from "date-fns";

/**
 * format Date to yyyy-MM-dd HH:mm
 * @param date
 * @returns
 */
export function formatDate(date: Date) {
	return format(date, "yyyy-MM-dd HH:mm");
}
