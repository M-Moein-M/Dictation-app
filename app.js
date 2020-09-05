const express = require('express');
const exhbs = require('express-handlebars');

const app = express();
app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server is running at port ${port}`));

// routes
app.use('/', require('./routes/index.js'));

// handlebar
app.engine('handlebars', exhbs());
app.set('view engine', 'handlebars');
