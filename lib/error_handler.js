let error_handler = function (err, req, res, next) {
  console.error(err.stack);
  if (err.status == 404) {
    res.status(404).send(err.stack);
  }

  res.status(500).send("Something broke!");
};

module.exports = error_handler;
