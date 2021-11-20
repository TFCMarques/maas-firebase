const {db, endpoint, FieldValue} = require("../util/config");
const axios = require("axios");

exports.getAllServiceRuns = (request, response) => {
  const doc = db.collection("services").doc(`${request.params.serviceId}`);
  doc.collection("runs").orderBy("lastUpdated", "desc").get().then((data) => {
    const runs = [];
    data.forEach((doc) => {
      runs.push({
        uuid: doc.id,
        lastUpdated: doc.data().lastUpdated,
        logs: doc.data().logs,
        status: doc.data().status,
      });
    });
    return response.json(runs);
  }).catch((err) => {
    console.error(err);
    return response.status(500).json({error: err});
  });
};

exports.createServiceRun = (request, response) => {
  const serviceId = request.params.serviceId;
  const document = db.collection("services").doc(`${serviceId}`);
  document.set({runCount: FieldValue.increment(1)}, {merge: true});
  document.get().then((doc) => {
    if (!doc.exists) {
      return response.status(404).json({error: "Service not found."});
    }
    const url = doc.data().url;
    const requestBody = doc.data().requestBody;
    const newRun = {
      status: "Starting",
      lastUpdated: new Date().toLocaleString(),
      logs: [],
    };
    document.collection("runs").add(newRun).then((doc) => {
      const statusCallback =
        `${endpoint}/services/${serviceId}/runs/${doc.id}/status`;
      const logCallback =
        `${endpoint}/services/${serviceId}/runs/${doc.id}/log`;
      const requestData = {
        runId: doc.id,
        statusCallback: statusCallback,
        logCallback: logCallback,
      };
      axios({
        method: "POST",
        url: url,
        data: joinObjects(JSON.parse(requestBody), requestData),
      }).then((res) => {
        return response.json({msg: "Successfully run service"});
      }).catch((err) =>{
        console.error(err);
        return deleteServiceRun(serviceId, doc.id, response);
      });
    }).catch((err) => {
      console.error(err);
      return response.status(500).json({error: err});
    });
  });
};

exports.updateServiceRunStatus = (request, response) => {
  const service = db.collection("services").doc(`${request.params.serviceId}`);
  service.collection("runs").doc(`${request.params.runId}`)
      .update({
        lastUpdated: new Date().toLocaleString(),
        status: request.body.status,
      }).then((doc) => {
        const result = request.body;
        result.uuid = doc.id;
        return response.json(result);
      }).catch((err) => {
        console.error(err);
        return response.status(500).json({error: err});
      });
};

exports.updateServiceRunLogs = (request, response) => {
  const service = db.collection("services").doc(`${request.params.serviceId}`);
  service.collection("runs").doc(`${request.params.runId}`)
      .update({
        lastUpdated: new Date().toLocaleString(),
        logs: FieldValue.arrayUnion(request.body.log),
      }).then((doc) => {
        const result = request.body;
        result.uuid = doc.id;
        return response.json(result);
      }).catch((err) => {
        console.error(err);
        return response.status(500).json({error: err});
      });
};

const deleteServiceRun = (serviceId, runId, response) => {
  const service = db.collection("services").doc(serviceId);
  const run = service.collection("runs").doc(runId);
  run.get().then((doc) => {
    if (!doc.exists) {
      return response.status(404).json({error: "Service not found."});
    }
    run.delete();
    return response.json({msg: "Successfully deleted service"});
  }).catch((err) => {
    console.error(err);
    return response.status(500).json({error: err});
  });
};

const joinObjects = (source, target) => {
  for (const key in source) {
    if (source[key]) {
      target[key] = source[key];
    }
  }
  return target;
};
