import mongoose from "mongoose";

class MongoClass {
  constructor(collectionName, docSchema) {
    this.baseModel = mongoose.model(collectionName, docSchema);
  }

  async getAll() {
    try {
      const all = await this.baseModel.find({});
      return all;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getOne(id) {
    try {
      const one = await this.baseModel.findById(id);
      return one;
    } catch (err) {
      throw new Error(err);
    }
  }

  async create(doc) {
    try {
      const newDoc = await this.baseModel.create(doc);
      return newDoc;
    } catch (err) {
      throw new Error(err);
    }
  }

  async update(id, doc) {
    try {
      await this.baseModel.findByIdAndUpdate(id, doc);
      const docUpdated = await this.baseModel.findById(id);
      return docUpdated;
    } catch (err) {
      throw new Error(err);
    }
  }

  async delete(id) {
    try {
      const deletedDoc = await this.baseModel.findByIdAndDelete(id);
      return deletedDoc;
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default MongoClass;
