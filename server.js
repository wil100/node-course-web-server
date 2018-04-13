const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000; // configure for heroku and local

// create alias for express()
const app = express();
hbs.registerPartials(__dirname + '/views/partials');
// set the view engine
app.set('view engine','hbs');
//setup middleware
app.use((req,res,next)=> {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n',(e)=>{
    if(e) {
      console.log('Unable to log information.');
    }
  });
  next();
});
// setup maintenance - no next, so it doesn't render anything else
// app.use((req,res,next)=>{
//   res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));






// setup helper for the year
hbs.registerHelper('getCurrentYear', ()=> {
  return new Date().getFullYear()
});
// setup a function helper that accepts a parameter
hbs.registerHelper('screamIt', (text)=> {
  return text.toUpperCase();
});

// setup the home page
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website',
    currentYear: new Date().getFullYear()
  });
});
// setup about page
app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
    currentYear: new Date().getFullYear()
  });
});

// /bad - send back json with errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});


// start the server on port 3000
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
