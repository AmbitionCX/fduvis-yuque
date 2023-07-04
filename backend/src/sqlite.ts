import { Database } from "sqlite3";
import * as path from 'path';

const db_path = path.resolve(`${__dirname}/../sql/sqlite.db`);

const db = new Database(db_path, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to disk file database.');
});

export default db