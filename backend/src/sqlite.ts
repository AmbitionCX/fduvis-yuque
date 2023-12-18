import { IsString, IsNumber, Length } from 'class-validator';
import { Database } from "sqlite3";
import * as path from 'path';
import axios from 'axios';
import fs from 'fs';


const db_path = path.resolve(`${__dirname}/../sql/sqlite.db`);

export class userInfo {
    @IsString()
    user_name?: string;

    @IsString()
    user_id?: string;

    @IsString()
    user_login?: string;

    @IsString()
    @Length(42)
    user_wallet?: string;

    @IsNumber()
    user_balance?: number;
}

export const db = new Database(db_path, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to disk file database.');
});

export const read_users = () => {

}

const create_tables = () => {
    db.exec(fs.readFileSync(path.join(__dirname, '/../sql/sqlite_yq_users.sql')).toString());
    db.exec(fs.readFileSync(path.join(__dirname, '/../sql/sqlite_yq_tokens.sql')).toString());
    db.exec(fs.readFileSync(path.join(__dirname, '/../sql/sqlite_yq_nfts.sql')).toString());
}

const insert_users = async (user_name: string, user_login: string, user_wallet: string) => {
    let input = new userInfo();
    input.user_name = user_name;
    input.user_login = user_login;
    input.user_wallet = user_wallet;
    input.user_balance = 0;

    try {
        const endpoint = "https://fduvis.yuque.com/api/v2/users/" + input.user_login;
        const auth = {
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "axios/1.4.0",
                "X-Auth-Token": process.env.YUQUE_TOKEN,
            }
        };
        const response = await axios.get(endpoint, auth);
        input.user_id = response.data.data.id;
    } catch (error) {
        console.log(error);
    }

    let sql = "INSERT OR REPLACE INTO yq_users (user_name, user_id, user_login, user_wallet, user_balance) VALUES (?,?,?,?,?)"
    db.run(sql, [input.user_name, input.user_id, input.user_login, input.user_wallet, input.user_balance],
        (err) => {
            if (err) {
                return console.log(err.message);
            }
        })
}

insert_users("zhangxiaowen", "aichiwanzidepaidaxing", "0x40026f83dDDf412d872fCFC08fF2AB1a277ec2C1")
