const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
exports.putStatus = functions.https.onRequest((request, response) => {
  if (request.method !== 'PUT') {
    response.status(405).send('Method Not Allowed');
    return;
  }
  let cinemaId = request.body.cinemaId;
  let status = request.body.status;
  admin.database().ref("/cinema/" + cinemaId).set({
    status: status
  });
  response.send("OK");
});

exports.summary = functions.https.onRequest((request, response) => {
  let cinemaId = request.query.cinemaId;
  admin.database().ref("/vote/" + cinemaId).once('value')
  .then(result => {
    response.send(result);
  })
  .catch(error => {
    response.status(404).send({ message: 'Not Found' })
  });
});

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from FGO!");
});
