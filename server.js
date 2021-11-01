const debug = require('debug')('bug-tracker:server');
const dbUtil = require("./utils/db");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  // debug(process.env)
}
const app = require("./app");

dbUtil.connectToDb();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  debug(`App running on port ${port}...`);
});
