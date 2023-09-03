import { FastifyServerOptions } from "fastify";
import buildApp from "./src/app";
import config from "./src/config";
import mongoose, { ConnectOptions } from "mongoose";

const options: FastifyServerOptions = {
  logger: true,
};

const app = buildApp(options);

mongoose
  .connect(config.mongodb.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
  } as ConnectOptions)
  .then((db) => {
    app.log.info("Database Connected Successfuly.");
  })
  .catch((err) => {
    app.log.error("Error Connectiong to the Database: " + err);
  });

app.listen(config.port);
