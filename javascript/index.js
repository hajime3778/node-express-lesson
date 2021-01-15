var express = require("express");
var app = express();

var server = app.listen(3000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});

var todoList = [
  {
      id: 0,
      title: "Sample1",
      description: "Sample1"
  },{
    id: 1,
    title: "Sample2",
    description: "Sample2"
  }
]

app.get("/", function(req, res, next){
    res.json(todoList);
});
