class ApiFeatures {
  // Modal Function --> find()
  // query parameters --> req.query
  constructor(modalFunction, queryParameters) {
    this.modalFunction = modalFunction;
    this.queryParameters = queryParameters;
  }

  filter() {
    const requestObject = { ...this.queryParameters };
    const excludeElements = ["sort", "page", "limit", "fields"];

    excludeElements.forEach((el) => {
      delete requestObject[el];
    });

    let QueryStr = JSON.stringify(requestObject);
    QueryStr = QueryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.modalFunction = this.modalFunction.find(JSON.parse(QueryStr));
    return this;
  }
  sort() {
    if (this.queryParameters.sort) {
      const sortBy = this.queryParameters.sort.split(",").join(" ");
      this.modalFunction = this.modalFunction.sort(sortBy);
    } else {
      this.modalFunction = this.modalFunction.sort("-price");
    }
    return this;
  }
  limit() {
    if (this.queryParameters.fields) {
      const fields = this.queryParameters.fields.split(",").join(" ");
      this.modalFunction = this.modalFunction.select(fields);
    } else {
      this.modalFunction = this.modalFunction.select("-__v");
    }
    return this;
  }
  paginate() {
    if (this.queryParameters.page || this.queryParameters.limit) {
      const page = this.queryParameters.page * 1 || 1;
      const limit = this.queryParameters.limit * 1 || 1;
      const skip = (page - 1) * limit;

      this.modalFunction = this.modalFunction.skip(skip).limit(limit);
    }
    return this;
  }
}

module.exports = ApiFeatures;
