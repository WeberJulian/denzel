/* eslint-disable no-console, no-process-exit */
require('dotenv').config()
const imdb = require('./src/imdb');
var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require("body-parser");
var url = require('url');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const DENZEL_IMDB_ID = 'nm0000243';

const uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;

app.get("/movies/populate",  async (req, res) => {
  console.log("Fetching films...")
  var err, db = await mongodb.MongoClient.connect(uri);
  if(err) throw err;
  const movies = await imdb(DENZEL_IMDB_ID);
  try{
    var err = await db.collection("movies").drop()
  }catch(e){}
  var err = await db.collection("movies").insertMany(movies)
  console.log("Done !")
  res.send({total: movies.length});
});

app.get("/movies",  async (req, res) => {
  var err, db = await mongodb.MongoClient.connect(uri);
  if(err) throw err;
  var goodOne = false
  while (!goodOne){
    var movie = await db.collection("movies").aggregate(
      [ { $sample: { size: 1 } } ]
    ).toArray()
    if(movie[0].metascore >= 70){
      goodOne = true
    }
  }
  res.send(movie[0]);
});

app.get("/movies/:id",  async (req, res) => {
  var err, db = await mongodb.MongoClient.connect(uri);
  if(err) throw err;
  var movie = await db.collection("movies").findOne({id: req.params.id})
  if(movie === null){
    res.send("no results");
  }
  res.send(movie);
});


var listener = app.listen("9292", function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

