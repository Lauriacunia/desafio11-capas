class HomeController {
  async viewHome(req, res) {
    try {
      /** Passport guarda automagicamente (en en login) los datos del user en la session
       *  y puede accederse a ellos con req.user
       */
      console.log("usuario guardado en session: ", req.user);
      const user = req.user;
      console.log("user", user);
      res.render("home", { user });
    } catch (err) {
      res.status(err.status || 500).json({
        status: "error",
        payload: err.message,
      });
    }
  }
}

const homeController = new HomeController();
const { viewHome } = homeController;
export { viewHome };
