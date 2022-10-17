"use strict";

var error_handler = function error_handler(err, req, res, next) {
  console.error(err.stack);

  if (err.status == 404) {
    res.status(404).send(err.stack);
  }

  res.status(500).send("Something broke!");
};

module.exports = error_handler;