var express = require('express');
var app = express();
var formidable = require('express-formidable');
var fs = require('fs');
var mysql = require('mysql'); //ny



app.use(express.static("public"));
app.use(formidable());

//Testar lite
// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "cute_animals",
//   port: 8889
// });
//
// con.connect(function(err) {
//   if (err) {console.log("error")}
//   else {console.log("you are Connected!")}
//
//    con.query('SELECT animal FROM animals', function(err, results) {
//      if(err) {console.log("det blev fel")}
//      else {console.log(results)}
//  });
//
// });

app.post('/create-post', function (req, res) {

  fs.readFile(__dirname + '/data/posts.json', function (error, file) {
    var newValue = req.fields.blogpost;
    var blogPost = {[JSON.stringify(Date.now())] : newValue};
    var parsedFile = JSON.parse(file);
    var myObject = Object.assign(parsedFile, blogPost);
    var finalObject = JSON.stringify(myObject);

    fs.writeFile(__dirname + '/data/posts.json', finalObject, function (error) {
      if (error) {console.log("an error")}
      else {res.send(blogPost)}
    });
  });
});

app.get('/get-posts', function (req, res) {
  //res.sendFile(__dirname + '/data/posts.json');
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "cute_animals",
    port: 8889
  });

  con.connect(function(err) {
    if (err) {console.log("error")}
    else {console.log("you are Connected!")}

     con.query('SELECT animal FROM animals', function(err, results) {
       if(err) {console.log("det blev fel")}
       else {
         res.send(results)
       }
   });

  });
});

// app.get('/', function (req, res) {
//
//   con.query('SELECT * FROM animals', function(err, results) {
//     if(err) {console.log("det blev fel")}
//     else {res.render(results[0].animal)}
//
//           });
//
//
// });

app.listen(3000, function () {
  console.log('Hej! Server is listening on port 3000. Ready to accept requests!');
});
