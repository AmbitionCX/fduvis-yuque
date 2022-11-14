const express = require('express');
const bodyParser = require('body-parser');
const {sql} = require('@databases/pg');
const db = require('./database');
const txFunctions = require('./transactions');

const app = express();
const port = 8083;
require('dotenv').config();

app.use(bodyParser.json());

async function getUsersBalance(){
  let usersBalance = await db.query(sql`select user_name, user_id, user_balance from yq_users`);
  let sortedBalance = usersBalance.sort( function  sortByBalance(a, b){
    return b.user_balance < a.user_balance ? -1 // push a to front
        :  b.user_balance > a.user_balance ? 1 // push a to end
        :  0;
  })
  return sortedBalance;
}

async function getUserActions(user_id){
  let userActions = await db.query(sql`select f_action, f_doc, f_time from yq_actions where f_user = ${user_id}`);
  return userActions;
}

app.get('/getUsersBalance', (request, response) => {
  getUsersBalance()
    .then(results => {
      response.send(results);
    });
})

app.get('/getUserActions', (request, response) => {
  getUserActions(request.query.user_id)
    .then(results => {
      response.send(results);
    });
})

// update user_balance in database every 10 mins
const minutes = 5;
setInterval(function() {
  txFunctions.UpdateBalance();
}, minutes * 60 * 1000);

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/frontend/main.html');
})

app.post('/', async (req, res) => {

  const user_id = req.body.data.actor_id;
  const update_time = req.body.data.updated_at;
  const action_type = req.body.data.action_type;
  const doc_path = req.body.data.path;

  let doc_title;
  if ( action_type.includes("comment") ) {
    doc_title = req.body.data.commentable.title;
  } else {
    doc_title = req.body.data.title;
  }

  // check if duplicated
  let previousAction = await db.query(sql`select * from yq_actions where f_user=${user_id} and f_action=${action_type} and f_time=${update_time}`);
  if( previousAction.length == 0 ){
    // token according to the action
    let token_amount = 0;
    switch (action_type) {
      case 'publish': token_amount = 2; break;
      case 'update': token_amount = 2; break;
      case 'comment_create': token_amount = 1; break;
      case 'comment_reply_create': token_amount = 1; break;
      default:
        res.end(`${action_type} action not supported.`);
    };
    // read address from database
    let addressMessage = await db.query(sql`select user_wallet from yq_users where user_id=${user_id}`);
    let target_address = addressMessage[0].user_wallet;

    // Transfor tokens to address
    await txFunctions.sendTransaction(target_address, token_amount.toString());
    await db.query(sql`
        insert into yq_actions(f_user, f_path, f_doc, f_action, f_time, f_amount)
        values (${user_id}, ${doc_path}, ${doc_title}, ${action_type}, ${update_time}, ${token_amount})
    `);
    await db.dispose();
  } // if action is not duplicated
})

app.listen(port, function () {
  console.log(`Yuque webhook listening on port ${port}`);
});