export const getYearFromDate = (date) => {
    // if not a date or invalid date, return null
    if (!date || isNaN(new Date(date).getTime())) return null;
    // get year from date
    return new Date(date).getFullYear();
}