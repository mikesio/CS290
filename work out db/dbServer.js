var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 6542);
app.use(express.static('public'));

/* Used code from http://johnzhang.io/options-request-in-express *
* to handle 404 options error when making post request*/
app.options("/*", function(req, res, next){
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
res.send(200);
});


app.get('/',function(req,res,next){
  res.render('home');
});


app.get('/test',function(req,res,next){
      console.log("Request received");
      res.type('text/plain');
      res.send(JSON.stringify('back to you'));
});


app.get('/getData',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.send(rows);
  });
});


app.post('/insert',function(req,res,next){

  //ADD query
  mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?,?,?,?,?)", 
    [req.body.name, req.body.reps,req.body.weight,req.body.date,req.body.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }

    //SELECT query of the new added record
    mysql.pool.query('SELECT * FROM workouts WHERE id=(SELECT MAX(id) FROM workouts)', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      res.send(JSON.stringify(rows));
    });
  });
});


app.post('/delete',function(req,res,next){
  mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    res.send();
  });
});



app.post('/update',function(req,res,next){
  mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
    [req.body.name, req.body.reps,req.body.weight,req.body.date,req.body.lbs,req.body.id],
    function(err, result){
    if(err){
      next(err);
      return;
    }
    res.send();
  });
});


app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(){ 
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    });
  });
});


app.use(function(req,res){
  res.status(404);
  res.render('404');
});


app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});


app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
