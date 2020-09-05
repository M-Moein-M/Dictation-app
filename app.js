const express = require('express');
const exhbs = require('express-handlebars');

const app = express();
app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server is running at port ${port}`));

// html form middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// handlebar
app.engine('handlebars', exhbs());
app.set('view engine', 'handlebars');

// routes
app.use('/', require('./routes/index.js'));
app.use('/user', require('./routes/user'));
