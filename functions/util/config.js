const admin = require("firebase-admin");
// const functions = require("firebase-functions");

admin.initializeApp(/* {
  credential: admin.credential.cert({
    privateKey: functions.config().private.key.replace(/\\n/g, "\n"),
    projectId: functions.config().project.id,
    clientEmail: functions.config().client.email,
  }),
  databaseURL: "https://maas-31124-default-rtdb.firebaseio.com",
}*/);

const endpoint = "http://localhost:5001/maas-31124/us-central1/api";
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

module.exports = {admin, db, endpoint, FieldValue};
