const Product = require("../models/Product");

class ProductRepository {
  async findAll(filter = {}) {
    return await Product.find({ isDeleted: false, ...filter });
  }

  async findById(id) {
    // Support both numeric id and MongoDB ObjectId
    const query = isNaN(id) ? { _id: id } : { id: Number(id) };
    return await Product.findOne({ ...query, isDeleted: false });
  }

  async create(data) {
    // Auto-generate numeric id if not provided
    if (!data.id) {
      const maxProduct = await Product.findOne().sort("-id");
      data.id = maxProduct && maxProduct.id ? maxProduct.id + 1 : 1;
    }
    return await Product.create(data);
  }

  async update(id, data) {
    const query = isNaN(id) ? { _id: id } : { id: Number(id) };
    return await Product.findOneAndUpdate(
      { ...query, isDeleted: false },
      data,
      { new: true }
    );
  }

  async softDelete(id) {
    const query = isNaN(id) ? { _id: id } : { id: Number(id) };
    return await Product.findOneAndUpdate(
      query,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
  }

  async restore(id) {
    const query = isNaN(id) ? { _id: id } : { id: Number(id) };
    return await Product.findOneAndUpdate(
      query,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );
  }
}

module.exports = new ProductRepository();
