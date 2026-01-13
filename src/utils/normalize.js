export const mapItemWithBook = (item) => ({
  bookId: item.book?._id?.toString() || item.book?.toString(),
  quantity: item.quantity,
  book: item.book,
});
