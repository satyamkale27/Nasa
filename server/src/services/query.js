const DEFAULT_PAGE_LIMIT = 0; // in mongo if we pass 0 it will return all the documents //
const DEFAULT_PAGE_NUMBER = 1;
function getPagination(query) {
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER; // || if no page is passed in query then default value will be 1 //
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
  const skip = (page - 1) * limit;
  return {
    skip,
    limit,
  };
}
module.exports = {
  getPagination,
};
