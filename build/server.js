//! Dependencies:
var express = require('express');
var mongoose = require('mongoose');
var mongojs = require('mongojs');
var axios = require('axios');
var cheerio = require('cheerio');
var request = require('request');
var db = require('./models');
//! Destructure Mongoose for Schema:
var Schema = mongoose.Schema;
//! Assign a PORT, utilize Express, define connection:
var PORT = process.env.PORT || 4607;
var app = express();
var dbase = mongoose.connection;
//! Set DB to be utilized if deployed, otherwise localhost:
var localDbUri = 'mongodb://localhost/realtorNews';
var MONGODB_URI = process.env.MONGODB_URI;
//! Instruct express how to handle information received:
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//! Instruct express to serve from the public folder:
app.use(express.static('public'));
//! Conditional for initializing connection to DB:
process.env.MONGODB_URI ? mongoose.connect(MONGODB_URI) : mongoose.connect(localDbUri);
//! Event emitters for database interactions:
dbase.on('error', function (error) {
    console.log("Mongoose Error:\n" + error);
});
dbase.once('open', function () {
    console.log("Connection successful on port: " + PORT);
});
//* GET route for scraping information source:
app.get('/scrape', function (_req, res) {
    axios.get('https://www.realtor.com/news/real-estate-news/').then(function (response) {
        var $ = cheerio.load(response.data);
        $('.post .item').each(function (_index, element) {
            var result = {
                title: $(element)
                    .children('a')
                    .children('.headline')
                    .children('h4')
                    .text(),
                link: $(element)
                    .children('.overlay-link')
                    .attr('href'),
                image: $(element)
                    .children('.thumbnail')
                    .children('.wp-post-image')
                    .attr('src')
            };
            console.log('\n__________________*********______________');
            console.log("Title:" + result.title);
            console.log("The image src " + result.image);
            console.log("The link " + result.link);
            db.Article.create(result)
                .then(function (dbArticle) {
                console.log("Article successfully created:\n" + dbArticle);
            })
                .catch(function (error) {
                console.log("There has been an error:\n" + error);
            });
        });
        res.send('Scrape Complete!');
    });
});
app.get('/clear', function (_req, res) {
    db.Article.deleteMany({}).then(function (_dbArticle) {
        res.send('deleted');
    });
});
//* GET route for all articles from DB:
app.get('/articles', function (_req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
        res.json(dbArticle);
    })
        .catch(function (err) {
        res.json(err);
    });
});
//* GET route for only saved articles:
app.get('/saved', function (_req, res) {
    db.Article.find({ saved: true })
        .then(function (dbArticle) {
        res.json(dbArticle);
    })
        .catch(function (err) {
        res.json(err);
    });
});
//* POST route for updating an article in the DB:
app.post('/save/:id', function (req, res) {
    db.Article.update({
        _id: mongojs.ObjectId(req.params.id)
    }, {
        $set: {
            saved: true
        }
    }, function (error, edited) {
        if (error) {
            console.log("There has been an error:\n" + error);
            res.send(error);
        }
        else {
            console.log(edited);
            res.send(edited);
        }
    });
});
//* POST route for updating an article in the DB:
app.post('/unsave/:id', function (req, res) {
    db.Article.update({
        _id: mongojs.ObjectId(req.params.id)
    }, {
        $set: {
            saved: false
        }
    }, function (error, edited) {
        if (error) {
            console.log("There has been an error:\n" + error);
            res.send(error);
        }
        else {
            console.log(edited);
            res.send(edited);
        }
    });
});
//* GET route for articles by ID:
app.get('/notes/:id', function (req, res) {
    db.Article.findById(req.params.id)
        .populate('notes')
        .then(function (dbArticle) {
        res.json(dbArticle);
    })
        .catch(function (err) {
        res.json(err);
    });
});
//* POST route for creating a new note:
app.post('/note/:id', function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
        console.log("New database notation:\n" + dbNote);
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
    })
        .then(function (dbArticle) {
        res.json(dbArticle);
    })
        .catch(function (err) {
        res.json(err);
    });
});
//* Initializes the server:
app.listen(PORT, function () {
    console.log("Running on port: " + PORT);
});
//# sourceMappingURL=server.js.map