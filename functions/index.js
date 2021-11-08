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
  runService,
} = require("./api/services");

// Services
app.get("/services", getAllServices);
app.get("/services/:serviceId", getService);
app.put("/services/:serviceId", updateService);
app.post("/services", createService);
app.delete("/services/:serviceId", deleteService);

// Runs
// app.get("/services/:serviceId/runs", getAllRuns);
// app.get("/services/:serviceId/runs/:runId", getRun);
// app.put("/services/:serviceId/runs/:runId", updateRun);
// app.post("/services/:serviceId/runs", createRun);
// app.delete("/services/:serviceId/runs/:runId")

app.get("/services/:serviceId/run", runService);

exports.api = functions.https.onRequest(app);
