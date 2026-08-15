const Product = require("../models/Product");

class ProductRepository {
  async findAll(filter = {}) {
    return await Product.find({ isDeleted: false, ...filter });
  }

  async findById(id) {
    return await Product.findOne({ _id: id, isDeleted: false });
  }

  async create(data) {
    return await Product.create(data);
  }

  async update(id, data) {
    return await Product.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true }
    );
  }

  async softDelete(id) {
    return await Product.findOneAndUpdate(
      { _id: id },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
  }
}

module.exports = new ProductRepository();
