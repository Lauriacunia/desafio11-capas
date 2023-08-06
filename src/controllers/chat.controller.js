class ChatController {
  async viewChat(req, res) {
    try {
      res.render("chat");
    } catch (err) {
      res.status(err.status || 500).json({
        status: "error",
        payload: err.message,
      });
    }
  }
}

const chatController = new ChatController();
const { viewChat } = chatController;
export { viewChat };
