const {db} = require("../util/admin");

exports.createService = (request, response) => {
  const newService = {
    name: request.body.name,
    description: request.body.description,
    hook: request.body.hook,
    url: request.body.url,
  };

  db.collection("services").add(newService).then((doc) => {
    const resNewService = newService;
    resNewService.uuid = doc.id;
    return response.json(resNewService);
  }).catch((err) => {
    response.status(500).json({"error": "Something went wrong"});
    console.error(err);
  });
};
