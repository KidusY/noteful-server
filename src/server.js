const app= require('./app')
const {PORT,DB_CONNECTION} = require('./config');
const knex = require('knex');

const db = knex({
	client     : 'pg',
	connection : DB_CONNECTION
});

//set a property on the app instance from the ./src/server.js file
app.set('db', db);

app.listen(PORT, ()=> {
    console.log(`Server listening at http://localhost:${PORT}`)
})