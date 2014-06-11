var fs = require('fs');
var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');

var db = new Db('storedvideos', new Server('locahost', 27017));
// Establish connection to db
db.open(function(err, db1) {
  console.log("start");
  // Our file ID
  var fileId = new ObjectID();
console.log("id created");
  // Open a new file  
  var gridStore = new GridStore(db, fileId, 'w');
console.log("store created");
  // Read the filesize of file on disk (provide your own)
  var fileSize = fs.statSync('C:/CardBoard/localvideos/videos/movie.mp4').size;
  console.log("file size read");
  // Read the buffered data for comparision reasons
  var data = fs.readFileSync('C:/CardBoard/localvideos/videos/movie.mp4');
console.log("file sync read");
  // Open the new file
  gridStore.open(function(err, gridStore1) {

    // Write the file to gridFS
    gridStore.writeFile('C:/CardBoard/localvideos/videos/movie.mp4', function(err, doc) {
      if(err) console.log(err);
      console.log(doc);
      // Read back all the written content and verify the correctness
      GridStore.read(db, fileId, function(err, fileData) {
        assert.equal(data.toString('base64'), fileData.toString('base64'))
        assert.equal(fileSize, fileData.length);

        db.close();
      });
    });
  });
});