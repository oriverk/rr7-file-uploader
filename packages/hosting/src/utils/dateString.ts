import { format } from "date-fns";

/**
 * format Date to yyyy-MM-dd HH:mm
 * @param date
 * @returns
 */
export const dateString = (date: Date) => format(date, "yyyy-MM-dd HH:mm");
