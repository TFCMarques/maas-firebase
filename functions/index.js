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

const {
  getAllServiceRuns,
  createServiceRun,
  updateServiceRunStatus,
  updateServiceRunLogs,
} = require("./api/runs");

const {
  getTotalRunsCount,
  // getRunsCountPerDay,
} = require("./api/stats");

// Services
app.get("/services", getAllServices);
app.get("/services/:serviceId", getService);
app.put("/services/:serviceId", updateService);
app.post("/services", createService);
app.delete("/services/:serviceId", deleteService);

// Runs
app.get("/services/:serviceId/runs", getAllServiceRuns);
// app.get("/services/:serviceId/runs/:runId", getRun);
app.put("/services/:serviceId/runs/:runId/status", updateServiceRunStatus);
app.put("/services/:serviceId/runs/:runId/log", updateServiceRunLogs);
app.post("/services/:serviceId/runs", createServiceRun);
// app.delete("/services/:serviceId/runs/:runId")

// Stats
app.get("/stats/services/runs/total", getTotalRunsCount);
// app.get("/stats/services/runs/timestamped", getRunsCountPerDay);

exports.api = functions.https.onRequest(app);
