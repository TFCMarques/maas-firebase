const functions = require("firebase-functions");

const app = require("express")();

const {
  getService,
  getAllServices,
  updateService,
  createService,
  deleteService,
} = require("./api/services");

app.get("/services", getAllServices);
app.get("/services/:serviceId", getService);
app.put("/services/:serviceId", updateService);
app.post("/services", createService);
app.delete("/services/:serviceId", deleteService);

exports.api = functions.https.onRequest(app);
