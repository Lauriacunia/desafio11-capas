import MongoStore from "connect-mongo";
import session from "express-session";
import { passport } from "../auth/passport-local.js";

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const DB_NAME = process.env.DB_NAME;

const sessionConfig = session({
  secret: "secret",
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.cyfup.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    ttl: 60 * 10, // 10 minutes
  }),
});

const passportInitialize = passport.initialize();
const passportSession = passport.session();

export { sessionConfig, passportInitialize, passportSession };
