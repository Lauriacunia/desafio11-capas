export default class BaseService {
  constructor(model) {
    this.db = model;
  }
  async getAll() {
    try {
      const all = await this.db.find({});
      return all;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getOne(id) {
    try {
      const one = await this.db.findById(id);
      return one;
    } catch (err) {
      throw new Error(err);
    }
  }

  async create(doc) {
    try {
      const newDoc = await this.db.create(doc);
      return newDoc;
    } catch (err) {
      throw new Error(err);
    }
  }

  async update(id, doc) {
    try {
      await this.db.findByIdAndUpdate(id, doc);
      const docUpdated = await this.db.findById(id);
      return docUpdated;
    } catch (err) {
      throw new Error(err);
    }
  }

  async delete(id) {
    try {
      const deletedDoc = await this.db.findByIdAndDelete(id);
      return deletedDoc;
    } catch (err) {
      throw new Error(err);
    }
  }
}
