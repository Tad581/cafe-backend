// Load .env file contents into `process.env `
require("dotenv").config();

const http = require("http");
const app = require("./index");

const server = http.createServer(app);
server.listen(process.env.PORT);
