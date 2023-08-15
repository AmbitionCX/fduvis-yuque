const {sql} = require('@databases/pg');
const db = require('./database');
const axios = require('axios');
require('dotenv').config();

export async function create_table() {
    await db.query(sql.file('./1.sql'));
    await db.dispose();
}

export async function write() {
    var user_id;
    var account = "0xd3c214E9e24200Cb836aCc287B9bd20D62790493";
    var name;
    var login = "liyun-xcz9y";
    try {
            const endpoint = "https://fduvis.yuque.com/api/v2/users/" + login;
            const auth = {
                    headers: {
                            "X-Auth-Token": process.env.YUQUE_TOKEN,
                    }
            };
            const response = await axios.get(endpoint, auth);
            name = response.data.data.name;
            user_id = response.data.data.id;
            // login = response.data.data.login;
    } catch (error) {
            console.log("Fetching User ID Failed");
            console.log(error);
    }

    await db.query(sql`
            insert into yq_users(user_name, user_id, user_login, user_wallet)
            values (${name}, ${user_id}, ${login}, ${account})
    `);
    await db.dispose();
}

export async function query() {
    
}