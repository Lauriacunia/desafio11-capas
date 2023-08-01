import MongoClass from "./MongoClass.js";
import { messagesSchema } from "./models/MessagesSchema.js";

export class MongoDBChats extends MongoClass {
  constructor() {
    super("messages", messagesSchema);
  }
}

export default MongoDBChats;
