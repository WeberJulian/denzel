var mongodb = require('mongodb');
const imdb = require('./src/imdb');
const uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;
const DENZEL_IMDB_ID = 'nm0000243';

module.exports = {
  movie: async function (args){
    if(!args.id){
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
      return movie[0]
    }
    else{
      var err, db = await mongodb.MongoClient.connect(uri);
      if(err) throw err;
      var movie = await db.collection("movies").findOne({id: args.id})
      return movie
    }
  },
  movies: async (args) => {
    var err, db = await mongodb.MongoClient.connect(uri);
    if(err) throw err;
    var metascore = args.metascore
    var limit = args.limit
    if (metascore === undefined){
      var movies = await db.collection("movies").find({}).toArray()
    }
    else{
      var movies = await db.collection("movies").find({metascore: {$gte: parseInt(metascore)}}).toArray()
    }
    if(limit === undefined){
      return movies
    }
    else{
      return movies.slice(0, parseInt(limit))
    }
  },
  populate: async () => {
    console.log("Fetching films...")
    var err, db = await mongodb.MongoClient.connect(uri);
    if(err) throw err;
    const movies = await imdb(DENZEL_IMDB_ID);
    try{
      var err = await db.collection("movies").drop()
    }catch(e){}
    var err = await db.collection("movies").insertMany(movies)
    console.log("Done !")
    return movies.length
  },
  review: async (args) => {
    var err, db = await mongodb.MongoClient.connect(uri);
    if(err) throw err;
    var id = args.id
    var movie = await db.collection("movies").findOne({id: args.id})
    if(movie === null){
      return "no films with this id"
    }
    else{
      await db.collection("movies").update({id: args.id}, {$set: {review: {date: args.date, review: args.review}}})
      return "ok"
    }
  }
}