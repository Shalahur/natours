class APIFeatures {
  constructor(query, queryParamStr) {
    this.query = query;
    this.queryParamStr = queryParamStr;
  }

  filter() {
    const queryObj = { ...this.queryParamStr };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryParamStr.sort) {
      const sortBy = this.queryParamStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdBy');
    }
    return this;
  }

  fieldsLimit() {
    if (this.queryParamStr.fields) {
      const fields = this.queryParamStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const page = this.queryParamStr.page * 1 || 1;
    const limit = this.queryParamStr.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
