const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const cors = require('cors')({origin: true});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
exports.putStatus = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
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
});

exports.summary = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    let cinemaId = request.query.cinemaId;
    admin.database().ref("/vote/" + cinemaId).once('value')
    .then(result => {
      response.send(result);
    })
    .catch(error => {
      response.status(404).send({ message: 'Not Found' })
    });
  });
});

exports.result = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    let cinemaId = request.query.cinemaId;
    admin.database().ref("/vote/" + cinemaId).once('value')
    .then(result => {
      let tmpkey = 0;
      let sum = {};
      result.forEach(branch => {
        branch.forEach(choice => {
          let choiseValue = choice.key;
          sum[choiseValue] = 0;
          choice.forEach(item => {
            let m = item.child("money").val();
            sum[choiseValue] += m;
          });
        });
      });
      let tmpTotalValue = 0;
      let voteResult = 'a'
      for (key in sum)
      {
        if (tmpTotalValue < sum[key])
        {
          tmpTotalValue = sum[key];
          voteResult = key;
        }
      }
      response.send({result: voteResult});
      //response.send(sum);

    })
    .catch(error => {
      response.status(404).send({ message: 'Not Found' })
    });
  });
});
  
exports.initialize = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    admin.database().ref("/cinema/cinema_id_a" ).set({
      status: 'stop'
    });
    admin.database().ref("/cinema/cinema_id_b" ).set({
      status: 'stop'
    });
    admin.database().ref("/cinema/cinema_id_c" ).set({
      status: 'stop'
    });
    admin.database().ref("/cinema/cinema_id_d" ).set({
      status: 'stop'
    });
    admin.database().ref("/cinema/cinema_id_e" ).set({
      status: 'stop'
    });
    admin.database().ref("/cinema/cinema_id_f" ).set({
      status: 'stop'
    });
    admin.database().ref("/cinema/cinema_id_g" ).set({
      status: 'stop'
    });

    admin.database().ref("/vote/").once('value')
    .then(result => {
      result.forEach(cinema => {
        let cinemaId = cinema.key;
        admin.database().ref("/vote/" + cinemaId + "/branch_id/").remove();
      });
    
      response.send({ initialize: 'OK' })
    })
    .catch(error => {
      response.status(404).send({ message: 'Not Found' })
    });
  });
});
