import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import indexRoutes from "./routes/mongo/indexRoutes.js";
import websockets from "./websockets/websockets.js";
import exphbs from "express-handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { connectMongoDB } from "./config/configMongoDB.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { passport } from "./auth/passport-local.js";
import flash from "connect-flash";

/** ★━━━━━━━━━━━★ variables ★━━━━━━━━━━━★ */

const app = express();
const PORT = 8080 || process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** ★━━━━━━━━━━━★ server httt & websocket ★━━━━━━━━━━━★ */

/** Tenemos dos servidores:  httpServer (http) y io (websocket)*/
const httpServer = http.createServer(app);

/** Crear nuevo servidor websocket */
const io = new SocketServer(httpServer);

websockets(io);

/** ★━━━━━━━━━━━★ middlewares ★━━━━━━━━━━━★*/
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

/** para gestionar cookies dentro de cada endpoint
 * lo que está entre parentesis es la clave secreta
 */
app.use(cookieParser("mySecret"));
/** guardar session en navegador*/
// app.use(
//   session({ secret: "un-re-secreto", resave: true, saveUninitialized: true })
// );
/** Persistir session en Mongo Atlas */
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const DB_NAME = process.env.DB_NAME;
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.cyfup.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
      ttl: 60 * 10, // 10 minutes
    }),
  })
);
app.use(passport.initialize()); // Inicializa passport
app.use(passport.session()); // Enlaza passport con la sesion

app.use(flash());

/** ★━━━━━━━━━━━★ frontend ★━━━━━━━━━━━★*/
// Configuración de Express Handlebars
const handlebars = exphbs.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});

app.engine("handlebars", handlebars.engine);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

/** ★━━━━━━━━━━━★ routes ★━━━━━━━━━━━★ */

app.use("/", indexRoutes);
app.use("/error", (req, res) => {
  const { errorMessage } = req.flash();
  res.render("error", { errorMessage });
});
// redirect to /home
app.get("/", (req, res) => {
  res.redirect("/home");
});
//not found
app.use("*", (req, res, next) => {
  res.render("notfound");
});

/** ★━━━━━━━━━━━★ connection mongoDB ★━━━━━━━━━━━★ */
connectMongoDB();

const server = httpServer.listen(PORT, () =>
  console.log(
    `🚀 Server started on port ${PORT}. 
      at ${new Date().toLocaleString()}`
  )
);
server.on("error", (err) => console.log(err));
