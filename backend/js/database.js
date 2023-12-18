const createConnectionPool = require('@databases/pg');
require('dotenv').config();

const db = createConnectionPool('postgres://' + process.env.PG_ENDPOINT);
module.exports = db;
