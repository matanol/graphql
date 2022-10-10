const express = require("express");
const app = express();
const port = 1000;
const graphQlHttp = require("express-graphql");
const mongoose = require("mongoose");
require("dotenv").config();

const graphQlSchema = require("./graphql/schema/schema");
const graphQlResolves = require("./graphql/resolves/resolves");

app.use(express.json());

app.use(
  "/graphql",
  graphQlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolves,
    graphiql: true,
  })
);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.listen(port, console.log(`[express] Server is running in ${port}`));
    console.log("[mongoose] is connected");
  })
  .catch((err) => {
    console.log(err);
  });
