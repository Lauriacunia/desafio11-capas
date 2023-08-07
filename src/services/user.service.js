import BaseService from "./base.service.js";
import userModel from "../repository/mongo/models/user.model.js";
class UserService extends BaseService {
  constructor() {
    super(userModel);
  }
  async getUserByUsername(username) {
    try {
      const user = await this.db.findOne(username);
      return user;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await this.db.findOne(email);
      return user;
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default new UserService();
