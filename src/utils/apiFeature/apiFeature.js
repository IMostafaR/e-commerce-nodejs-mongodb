/**
 * Class to create new API features such as pagination, filtering, sorting, searching, and selecting fields.
 */
export class APIFeatures {
  /**
   * Create a new instance of APIFeatures.
   *
   * @param {import('mongoose').Query} mongooseQuery - A Mongoose Query object.
   * @param {object} reqQuery - The request query parameters.
   */
  constructor(mongooseQuery, reqQuery) {
    /**
     * The Mongoose Query object to which API features are applied.
     * @type {import('mongoose').Query}
     */
    this.mongooseQuery = mongooseQuery;
    /**
     * The request query parameters.
     * @type {object}
     */
    this.reqQuery = reqQuery;
  }

  /**
   * Apply pagination to the query.
   *
   * @returns {APIFeatures} - The current APIFeatures instance for chaining.
   */
  pagination() {
    let { page } = this.reqQuery,
      skip,
      limit;

    !page || page <= 0
      ? ((limit = 0), (skip = limit))
      : ((limit = 2), (skip = (page - 1) * limit));

    this.page = page;
    this.limit = limit;

    this.mongooseQuery.skip(skip).limit(limit);

    return this;
  }

  /**
   * Apply filtering to the query.
   *
   * @returns {APIFeatures} - The current APIFeatures instance for chaining.
   */
  filter() {
    let queryObj = { ...this.reqQuery };
    const forbiddenQueries = ["page", "sort", "fields", "search"];
    forbiddenQueries.forEach(
      (forbiddenQuery) => delete queryObj[forbiddenQuery]
    );

    queryObj = JSON.parse(
      JSON.stringify(queryObj).replace(
        /\beq|gt|gte|lt|lte|ne\b/g,
        (match) => `$${match}`
      )
    );

    this.mongooseQuery.find(queryObj);

    return this;
  }

  /**
   * Apply sorting to the query.
   *
   * @returns {APIFeatures} - The current APIFeatures instance for chaining.
   */
  sort() {
    let { sort } = this.reqQuery;

    if (sort) {
      sort = sort.split(",").join(" ");
      this.mongooseQuery.sort(sort);
    }

    return this;
  }

  /**
   * Apply searching to the query.
   *
   * @returns {APIFeatures} - The current APIFeatures instance for chaining.
   */
  search() {
    let { search } = this.reqQuery,
      queryObj = {};

    if (search) {
      queryObj.name = { $regex: `${search}`, $options: "i" };
      this.mongooseQuery.find(queryObj);
    }

    return this;
  }

  /**
   * Apply field selection to the query.
   *
   * @returns {APIFeatures} - The current APIFeatures instance for chaining.
   */
  select() {
    let { fields } = this.reqQuery;

    if (fields) {
      fields = fields.split(",").join(" ");
      this.mongooseQuery.select(fields);
    }

    return this;
  }
}
