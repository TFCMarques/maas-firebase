const {db} = require("../util/config");

exports.getAllServices = (_, response) => {
  db.collection("services").orderBy("name", "asc").get().then((data) => {
    const services = [];
    data.forEach((doc) => {
      services.push({
        uuid: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        hook: doc.data().hook,
        url: doc.data().url,
      });
    });
    return response.json(services);
  }).catch((err) => {
    console.error(err);
    return response.status(500).json({error: err});
  });
};

exports.getService = (request, response) => {
  const document = db.collection("services").doc(`${request.params.serviceId}`);
  document.get().then((doc) => {
    if (!doc.exists) {
      return response.status(404).json({error: "Service not found."});
    }
    const result = doc.data();
    result.uuid = doc.id;
    return response.json(result);
  }).catch((err) => {
    console.error(err);
    return response.status(500).json({error: err});
  });
};

exports.updateService = (request, response) => {
  db.collection("services").doc(`${request.params.serviceId}`)
      .update(request.body).then((doc) => {
        const result = request.body;
        result.uuid = doc.id;
        return response.json(result);
      }).catch((err) => {
        console.error(err);
        return response.status(500).json({error: err});
      });
};

exports.createService = (request, response) => {
  db.collection("services").add(request.body).then((doc) => {
    const result = request.body;
    result.uuid = doc.id;
    return response.json(result);
  }).catch((err) => {
    console.error(err);
    return response.status(500).json({error: err});
  });
};

exports.deleteService = (request, response) => {
  const document = db.collection("services").doc(`${request.params.serviceId}`);
  document.get().then((doc) => {
    if (!doc.exists) {
      return response.status(404).json({error: "Service not found."});
    }
    document.delete();
    return response.json({msg: "Successfully deleted service"});
  }).catch((err) => {
    console.error(err);
    return response.status(500).json({error: err});
  });
};
