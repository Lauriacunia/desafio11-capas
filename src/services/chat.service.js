import BaseService from "./base.service.js";
import chatModel from "../repository/mongo/models/chat.model.js";

class ChatService extends BaseService {
  constructor() {
    super(chatModel);
  }
}

export default new ChatService();
