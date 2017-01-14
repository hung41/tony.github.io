var http = require('http'),
        fs = require('fs');

var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));
var mylib_b = require('./mylib/resources.js');
var mylib_f = require('./mylib/fortune.js');

app.use(function(req, res, next){
        if(!res.locals.partials) res.locals.partials = {};
        res.locals.partials.weatherContext = mylib_f.getWeatherData();
       next();
});

var handlebars = require('express-handlebars').create({
    defaultLayout:'main',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

app.use(require('body-parser').urlencoded({ extended: true }));

// set up handlebars view engine
//var handlebars = require('express-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.get('/vacation', function(req, res){
        res.render('vacation-views', {data:obj});
});

app.get('/tours', function(req, res){
        res.json(mylib_f.getWeatherData());
});

app.get('/test', function(req, res) {
        res.render('testpage');
});
app.get('/jq', function(req, res) {
        res.render('weather-views');
});
app.get('/index', function(req, res) {
        res.render('index');
});
app.get('/about', function(req, res) {
        res.render('about', { fortune: mylib_f.getFortune() });
});

app.get('/headers', function(req,res){
    //res.send(req.headers);
    //res.send(req.ip);
    //res.send(req.path);
    res.send(req.host);
});


// 404 catch-all handler (middleware)
app.use(function(req, res, next){
        res.status(404);
        res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
        console.error(err.stack);
        res.status(500);
        res.render('500');
});

app.listen(app.get('port'), function() {
    console.log( 'Express started ====> ' + app.get('env') +
       ' mode on http://localhost:' + app.get('port') +
        '; press Ctrl-C to terminate.' );
});