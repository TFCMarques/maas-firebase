const functions = require("firebase-functions");
const cors = require("cors")({origin: true});

const app = require("express")();
app.use(cors);

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

// app.get("/services/:serviceId/run", runService);
// app.post("/services/:serviceId/run", createServiceRun);

exports.api = functions.https.onRequest(app);
