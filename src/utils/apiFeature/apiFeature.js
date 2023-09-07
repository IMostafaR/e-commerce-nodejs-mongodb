export class APIFeatures {
  constructor(mongooseQuery, reqQuery) {
    this.mongooseQuery = mongooseQuery;
    this.reqQuery = reqQuery;
  }

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

  sort() {
    let { sort } = this.reqQuery;

    if (sort) {
      sort = sort.split(",").join(" ");
      this.mongooseQuery.sort(sort);
    }

    return this;
  }

  search() {
    let { search } = this.reqQuery,
      queryObj = {};

    if (search) {
      queryObj.name = { $regex: `${search}`, $options: "i" };
      this.mongooseQuery.find(queryObj);
    }

    return this;
  }

  select() {
    let { fields } = this.reqQuery;

    if (fields) {
      fields = fields.split(",").join(" ");
      this.mongooseQuery.select(fields);
    }

    return this;
  }
}
