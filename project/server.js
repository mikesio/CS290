var express = require('express');

var app = express();
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var path = require('path');
 
var hbs = handlebars.create({
    defaultLayout:'main',
    helpers: {
        each_consoleFilter: function (list, console, keyword, opts) { 
          //console.log(arguments);
          var i, result = '';
          for(i = 0; i < list.length; ++i)
              if(list[i][console] == keyword)
                  result += opts.fn(list[i]);
          return result;
        }
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, '/public')));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('port', 5462);

  var context={
    game:[
      {
        name: "The Legend of Zelda: Breath of the Wild",
        console: "Switch", 
        price: "49.99", 
        imgURL: "/icon/zelda.jpg"
      },
      {
        name: "Final Fantasy XV",
        console: "PlayStation 4", 
        price: "39.99", 
        imgURL: "/icon/ffxv.jpg"
      },
      {
        name: "Dark Soul 3",
        console: "PlayStation 4", 
        price: "29.99", 
        imgURL: "/icon/darksoul3.jpg"
      },
      {
        name: "Grand Theft Auto V",
        console: "PlayStation 4", 
        price: "36.99", 
        imgURL: "/icon/gtav.jpg"
      },
      {
        name: "Knack 2",
        console: "PlayStation 4", 
        price: "19.99", 
        imgURL: "/icon/knack2.jpg"
      },
      {
        name: "Forza Motorsport 7",
        console: "Xbox One", 
        price: "35.99", 
        imgURL: "/icon/forza7.jpg"
      },
      {
        name: "Metal Gear Solid V: The Phantom Pain",
        console: "Xbox One", 
        price: "29.99", 
        imgURL: "/icon/mgs.jpg"
      },
      {
        name: "Gears of War 4",
        console: "Xbox One", 
        price: "32.99", 
        imgURL: "/icon/gearsofwar4.jpg"
      },

    ]
  };


app.get('/',function(req,res){
  res.render('home');
});

app.get('/instock',function(req,res){
  res.render('instock',context);
});

app.get('/coupon',function(req,res){
  res.render('coupon');
});

app.get('/contact',function(req,res){
  res.render('contact');
});

app.get('/switch',function(req,res){
  res.render('switch',context);
});

app.get('/ps4pro',function(req,res){
  res.render('ps4pro',context);
});

app.get('/xboxone',function(req,res){
  res.render('xboxone',context);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});


app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on port :' + app.get('port') + '; press Ctrl-C to terminate.');
});
