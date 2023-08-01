import { Router } from "express";
const router = Router();
import { isAuth } from "../../auth/passport-local.js";

router.get("/", isAuth, async (req, res) => {
  try {
    /**
     Setear una cookie
     res.cookie('cookie-test', 'informacion muy poderosa', { maxAge: 10000 });
       
     Obtener una cookie
     req.cookies['cookie-test']

     Obtener todas las cookies
     req.cookies

     Borrar una cookie
     res.clearCookie('cookie-test');

     Para firmar la cookie agregar el atributo signed en true.
      res.cookie('cookie-test', 'informacion muy poderosa', { signed: true });
    */
    res.cookie("cookie-test", "guardando cookie", {
      maxAge: 900000,
      httpOnly: true,
    });
    /** Ejemplo de session. Contador de visitas */
    if (req.session.count) {
      //🗨 a la session se le agrega una propiedad cont que guarda ese dato
      req.session.count++;
    } else {
      req.session.count = 1;
    }
    /**🗨 en el navegador se inyecta UNA SOLA COOKIE con el
     * id de la session que se llama connect.sid
     */
    // con req.session se accede a la session y a sus propiedades (keys y values)
    console.log("Visitas: " + req.session.count);
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
});

export default router;
