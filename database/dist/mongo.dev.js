"use strict";

var mongoose = require("mongoose");

var database = null;

function startDatabase() {
  var connection;
  return regeneratorRuntime.async(function startDatabase$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(mongoose.connect("mongodb://localhost:27017/chatDatabase")["catch"](function (error) {
            return console.error(error);
          }));

        case 2:
          connection = _context.sent;
          database = mongoose.connection;

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}

function getDatabase() {
  return regeneratorRuntime.async(function getDatabase$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (database) {
            _context2.next = 3;
            break;
          }

          _context2.next = 3;
          return regeneratorRuntime.awrap(startDatabase());

        case 3:
          return _context2.abrupt("return", database);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}

module.exports = {
  getDatabase: getDatabase,
  startDatabase: startDatabase
};