const app= require('./app')
const {PORT, DATABASE_URL } = require('./config');
const knex = require('knex');

const db = knex({
	client     : 'pg',
	connection :  DATABASE_URL 
});


//set a property on the app instance from the ./src/server.js file
app.set('db', db);

app.listen(PORT, ()=> {
    console.log(`Server listening at http://localhost:${PORT}`)
})