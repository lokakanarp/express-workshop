var express = require('express');
var app = express();
var formidable = require('express-formidable');
var fs = require('fs');
var mysql = require('mysql'); //ny



app.use(express.static("public"));
app.use(formidable());

//Testar lite
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "express_workshop_db",
  port: 8889
});

con.connect(function(err) {
  if (err) {console.log("error")}
  else {console.log("you are Connected!")}

});



app.post('/create-post', function (req, res) {
  var newValue = req.fields.blogpost;
  con.query('INSERT INTO blogposts (blogpost) VALUES ("'+ newValue +'")', function(err, data) {
    if(err) {console.log("det blev fel")}
    else {
      res.send(data);
    }
  })
  // fs.readFile(__dirname + '/data/posts.json', function (error, file) {
  //   var newValue = req.fields.blogpost;
  //   var blogPost = {[JSON.stringify(Date.now())] : newValue};
  //   var parsedFile = JSON.parse(file);
  //   var myObject = Object.assign(parsedFile, blogPost);
  //   var finalObject = JSON.stringify(myObject);
  //
  //   fs.writeFile(__dirname + '/data/posts.json', finalObject, function (error) {
  //     if (error) {console.log("an error")}
  //     else {res.send(blogPost)}
  //   });
  // });
});

app.get('/get-posts', function (req, res) {
  //res.sendFile(__dirname + '/data/posts.json');
  //var results;
  con.query('SELECT blogpost FROM blogposts', function(err, data) {
    if(err) {console.log("det blev fel")}
    else {
      //var results = data;
      res.send(data);

    }
  });
});

app.listen(3000, function () {
  console.log('Hej! Server is listening on port 3000. Ready to accept requests!');
});
