const functions = require("firebase-functions");

const app = require("express")();

const {
  createService,
} = require("./api/services");

// SERVICES
app.post("/services", createService);

exports.api = functions.https.onRequest(app);
