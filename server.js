var express = require('express');
var app = express();
var formidable = require('express-formidable');
var fs = require('fs');
var mysql = require('mysql'); //ny



app.use(express.static("public"));
app.use(formidable());

//Connection to database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "express_workshop_db",
  port: 8889
});

con.connect(function(err) {
  if (err) {console.log("error")}
  else {console.log("You are Connected!")}

});


//Handlers
app.post('/create-post', function (req, res) {
  var newBlogpost = req.fields.blogpost;
  var newTitle = req.fields.title;
  con.query('INSERT INTO blogposts (blogpost, title) VALUES ("'+ newBlogpost +'", "'+ newTitle +'")', function(err, data) {
    if(err) {console.log("Could not post")}
    else {
      var newId = data.insertId;
      var responseData = [{"blogpost" : newBlogpost, "title": newTitle, "id": newId}];
      res.send(responseData);
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
  con.query('SELECT * FROM blogposts ORDER BY date ASC', function(err, data) {
    if(err) {console.log("Could not get")}
    else {
      res.send(data);
    }
  });
});

app.get('/get-post', function (req, res) {
  var blogPostId = req.fields.id;

  //res.sendFile(__dirname + '/data/posts.json');
  con.query('SELECT * FROM blogposts WHERE id=' + blogPostId, function(err, data) {
    if(err) {console.log("Could not get")}
    else {
      res.send(data);
    }
  });
});

app.delete('/delete-post', function (req, res) {
  var blogPostId = req.fields.id;
  console.log(blogPostId);
  var deletedPost = req.fields;
  con.query('DELETE FROM blogposts WHERE id =' + blogPostId, function(err, data) {
    if(err) {console.log("no Could not delete")}
    else {
      res.send(deletedPost); //Se över detta??
    }
  })
})

app.listen(3000, function () {
  console.log('Hej! Server is listening on port 3000. Ready to accept requests!');
});
