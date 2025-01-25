export const sortByYearOfPublication = (arr) => {
  return arr.sort((a, b) => {
    // Handle empty or missing yearOfPublication
    if (!a.yearOfPublication) return 1;
    if (!b.yearOfPublication) return -1;

    // Compare dates using Date object comparison
    const dateA = new Date(a.yearOfPublication);
    const dateB = new Date(b.yearOfPublication);

    // Compare timestamps to sort from newest to oldest
    return dateB.getTime() - dateA.getTime();
  });
};
