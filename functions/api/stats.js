const {db} = require("../util/config");

exports.getTotalRunsCount = (_, response) => {
  let totalRuns = 0;
  db.collection("services").get().then((allServices) => {
    allServices.forEach((doc) => {
      totalRuns += doc.data().runCount;
    });
    return response.json({totalRuns: totalRuns});
  }).catch((err) => {
    console.error(err);
    return response.status(500).json({error: err});
  });
};

// TO FIX
exports.getRunsCountPerDay = (_, response) => {
  const runsCount = db.collection("services").get().then((allServices) => {
    const runsPerDay = {};
    allServices.forEach((serviceDoc) => {
      const service = db.collection("services").doc(serviceDoc.id);
      service.collection("runs").get().then((serviceRuns) => {
        serviceRuns.forEach((runDoc) => {
          const date = runDoc.data().lastUpdated.split(",")[0];
          runsPerDay[date] = (runsPerDay[date] || 0) + 1;
        });
        return runsPerDay;
      });
    });
    console.log(runsPerDay);
    return runsPerDay;
  });
  return response.json(runsCount);
};
