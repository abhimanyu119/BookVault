const fs = require("fs");

module.exports = (req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.ip} - ${req.method} ${
    req.url
  }\n`;
  fs.appendFileSync("requests.log", log);
  next();
};