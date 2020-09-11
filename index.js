//THIS FILE NEEDS TO BE FINISHED Y'ALL

var express = require('express');
var mysql = require('mysql');
var bodyParser = require("body-parser")
const PORT = process.env.PORT || 5000;

var app = express();
const { check, validationResult } = require("express-validator");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'brokensql',
    password : 'root'
  });


  app.get("/", (req, res) => {
    res.render("index");
});


  
app.post("/register",[
  check("name")
  //no empty space
  .trim()
  //name is required
  .notEmpty().withMessage("name is required")
  //if err go back
  .bail()
  //peramaters of symboles allowed
  .matches(/^[^-']([a-zA-ZÀ-ÖØ-öø-ÿ '-](?!.*''|--|  |- |' | '| -.*))+$/, 'g').withMessage("name should start with a letter and can only include letters with spaces, hyphens, apostrophies and the latin alphabet.")
  //if err go back
  .bail()
  //checks the length of database column
  .isLength({min:2, max:50}).withMessage("Please enter your full name 4 and 50 characters."),
  check("username")
  //letters and intergers are allowed
  .trim()
  //username must be inserted
  .notEmpty().withMessage("username is required")
  //if err go back
  .bail()
  //accepted characters
  .matches(/^[^-']([a-zA-ZÀ-ÖØ-öø-ÿ0-9 '-](?!.*''|--|  |- |' | '| -.*))+$/, 'g').withMessage("Username should start with a letter, and can only contain letters with spaces, numbers, hyphens, apostrophes and the latin alphabet.")
  .bail()
  .isLength({min:3, max:25}).withMessage("Please enter username, integers are allowed."),
  check("email")
  //there are no spaces in emails
  .trim()
  //email is required
  .notEmpty().withMessage("Email is required")
  //if err go back
  .bail()
  //excludes not allowed characters
  .matches(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,'g').withMessage("Email may contain letter, numbers, and must end with @domainname.com")
  //if err go back
  .bail()
  //exceptable length of characters
  .isLength({min:10, max:50}).withMessage("Please enter a email address up to 50 characters.")

], 
(req, res) => {  
  // validation of results
  let result = validationResult(req);
  // puts them in an object
  let errors = result.errors;  
  // consoles the errors
  for (let key in errors) {
    console.log("Validation failed:" + errors[key].msg);
}
    let name = req.body.name;
    let username = req.body.username;
    let email = req.body.email;
    
  if (!result.isEmpty()){
    //if error, alert is shown
    res.render("index", { errors, name, username, email })
  }
  else {
    //if correct insert in to customer
    let insert = "insert into customer(??, ??, ??) values (?, ?, ?)";
    connection.query(insert, [ "name", "username", "email",name, username, email], (err,results)=> {
      //if doesnt work go back
      if (err) {
        console.log(err);
    }
    let success = `Thank you!`
    res.render("index", { success, name, username, email });
    });
  }
});

app.get("/users", (req, res) => {
  connection.query('select * from customer', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
  res.send("results");
});
  });


app.listen(PORT, () => {
  console.log(`server running on ${PORT}`)
})