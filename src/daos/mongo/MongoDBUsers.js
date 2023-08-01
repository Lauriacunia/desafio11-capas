import MongoClass from "./MongoClass.js";
import { usersSchema } from "./models/UsersSchema.js";

export class MongoDBUsers extends MongoClass {
  constructor() {
    super("users", usersSchema);
  }

  async getUserByUsername(username) {
    try {
      const user = await this.baseModel.findOne(username);
      return user;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await this.baseModel.findOne(email);
      return user;
    } catch (err) {
      throw new Error(err);
    }
  }
}
export default MongoDBUsers;
