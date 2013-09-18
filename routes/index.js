var mongoose = require('mongoose'),
    _ = require('underscore');

mongoose.connect('mongodb://localhost/dogsdb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection to dogsdb is established.');
});

var dogSchema = mongoose.Schema({
  name: String,
  pedigree: String,
  other: String
});

var Dog = mongoose.model('Dog', dogSchema);


// responsible for get dogs/ and get dogs/1234
exports.dogs = function(req, res, next) {
  var id = req.params.id;
  if (id) {
    Dog.findOne({'_id': id}, function(err, item) {
      if (err) {
        console.log('500 finding a dog ' + id);
        next(err);
        /*res.send(500, {
          'developerMessage' : 'Something went wrong finding ' + id,
          'userMessage' : 'We apologise for this inconveniance. Our system couldnt find a dog you searched for. Our developers are about to start to fix this.',
          'errorCode' : 500,
          'moreInfo': 'www.google.com'
        });*/
      } else if (item) { // dog is found
        console.log(item);
        res.send(200, item);
      } else {
        console.log('404 finding a dog ' + id);
        next(err);
        /*res.send(404, {
          'developerMessage' : 'No such dog ' + id,
          'userMessage' : 'We apologise for this inconveniance. Our system was not able find a dog you searched for.',
          'errorCode' : 404,
          'moreInfo': 'www.google.com'
        });*/
      }
    });
  } else {  // id param is not present
    Dog.find(function(err, dogs) {
      if (err) {
        console.log('500 finding dogs');
        res.send(500, {
          'developerMessage' : 'Something went wrong while finding dogs',
          'userMessage' : 'We apologise for this inconveniance. Our system was not able find dogs you searched for. Our developers are about to start to fix this.',
          'errorCode' : 500,
          'moreInfo': 'www.google.com'
        });
      } else if (!_.isEmpty(dogs)) {
        console.log(dogs);
        res.send(200, dogs);
      } else {
        console.log('404 finding dogs');
        res.send(404, {
          'developerMessage' : 'No dogs',
          'userMessage' : 'We apologise for this inconveniance. Our system was not able find any dogs.',
          'errorCode' : 404,
          'moreInfo': 'www.google.com'
        });
      }
    });
  }
};

// creating new dogs
exports.createDog = function(req, res) {
  console.log('creating a new dog ' + req.body);

  var newDog = new Dog({
    name: req.body.name,
    pedigree: req.body.pedigree
  });

  newDog.save(function(err, newDog) {
    if (err) {
      console.log('Cannot save a new dog');
      res.send(500, {
        'developerMessage' : 'Something went wrong while saving a new dog',
        'userMessage' : 'We apologise for this inconveniance. Our system was not able save a new dog. Our developers are about to start to fix this.',
        'errorCode' : 500,
        'moreInfo': 'www.google.com'
      });
    }
    console.log('New dog is added to a database.');
    res.send(200, 'New dog is added to a database.');
  });
};

// updating a dog info - put dog/1234
exports.updateDog = function(req, res) {
  console.log('Updating a dog ' + req.params.id);

  Dog.findOne({ _id: req.params.id }, function (err, doc) {
    if (err) {
      console.log('500 ' + req.params.id);
      res.send(500, {
        'developerMessage' : 'Something went wrong while finding a dog by id',
        'userMessage' : 'We apologise for this inconveniance. Our system was not able find a dog you searched for. Our developers are about to start to fix this.',
        'errorCode' : 500,
        'moreInfo': 'www.google.com'
      });
    }
    doc.name = req.body['name'] || doc.name;
    doc.pedigree = req.body['pedigree'] || doc.pedigree;
    doc.other = req.body['other'] || doc.other;
    doc.save(function(err, updatedDog) {
      if (err) {
        console.log('500 ' + req.params.id);
        res.send(500, {
          'developerMessage' : 'Something went wrong while saving an updated dog to a databse.',
          'userMessage' : 'We apologise for this inconveniance. Our system was not able save a new dog info you provided. Our developers are about to start to fix this.',
          'errorCode' : 500,
          'moreInfo': 'www.google.com'
        });
      }
      console.log('Updated a dog' + updatedDog);
      res.send(200, 'Updated a dog' + updatedDog);
    });
  });
};

exports.deleteDog = function(req, res) {
  console.log('Deleting a dog :( ' + req.params.id);

  Dog.findByIdAndRemove(req.params.id, function(err, doc) {
    if (err) {
      console.log('500 ' + req.params.id);
      res.send(500, {
        'developerMessage' : 'Something went wrong while deleting a dog from the databse.',
        'userMessage' : 'We apologise for this inconveniance. Our system was not able delete a dog info form databse. Our developers are about to start to fix this.',
        'errorCode' : 500,
        'moreInfo': 'www.google.com'
      });
    }
    console.log('Deleted a dog ' + doc);
    res.send(200, 'Deleted a dog ' + doc);
  });
};

exports.owners = function(req, res) {
  var id = req.params.id;
  if (id) {
    if (owners[id]) {
      console.log(owners[id]);
      res.send(200, owners[id]);
    } else { // an owners with requested id doesn't exist
      console.log('404 ' + id);
      res.send(404, {
        'developerMessage' : 'There is no such person: ' + id,
        'userMessage' : 'We apologise for this inconveniance. Our system was not able find a person you searched for. Our developers are about to start to fix this.',
        'errorCode' : 404,
        'moreInfo': 'www.google.com'
      });
    }
  } // id param is not present
  console.log(owners);
  res.send(200, owners);
};
