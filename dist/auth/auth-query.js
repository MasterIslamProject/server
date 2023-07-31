"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeAuthQuery;

var _auth = _interopRequireDefault(require("./auth"));

var _errors = require("../helpers/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

function makeAuthQuery({
  database
}) {
  return Object.freeze({
    findByHeader,
    checkToken
  });

  async function findByHeader(token) {
    let status = 0;
    let message = "Nil";
    let res = false;
    let email = "";
    await jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, result) => {
      if (err) {
        // console.log("error discovered: "+err.name)
        if (err.name == "TokenExpiredError") {
          status = 401;
          message = "Token Expired";
        } else if (err.name == "JsonWebTokenError") {
          status = 401;
          message = "Wrong Token";
        } else {
          status = 401;
          message = "Token Error";
        }
      } else {
        res = true;
        email = result.email;
        status = 200;
        message = "Token Valid";
      }
    });

    if (res == true) {
      // console.log("The email is: "+email)
      const db = await database;
      const found = await db.collection('Users').findOne({
        email: email
      });

      if (found) {
        if (found.status == "Suspended") {
          status = 403;
          message = "Suspended";
        } else if (found.n_query > 4) {
          status = 403;
          message = "Suspended";
        }
      } else {
        status = 401;
        message = "Unauthorized";
      } // console.log("True status: "+status)


      res = {
        "status": status,
        "message": message
      };
      return res;
    } else {
      // console.log("false status: "+status)
      // console.log("false message: "+message)
      res = {
        "status": status,
        "message": message
      };
      return res;
    }
  }

  async function checkToken(token, email) {
    let status = 0;
    let message = "Nil";
    let res = false;
    await jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, result) => {
      if (err) {
        if (err.name == "TokenExpiredError") {
          status = 401;
          message = "Token Expired";
        } else {
          status = 401;
          message = "Token Error";
        }
      } else {
        if (result.email == email) {
          res = true;
          status = 200;
          message = "Token Valid";
        } else {
          status = 400;
          message = "Token Invalid";
        }
      }
    });

    if (res == true) {
      const db = await database;
      const found = await db.collection('Users').findOne({
        email: email
      });

      if (found) {
        if (found.status == "Suspended") {
          status = 403;
          message = "Suspended";
        } else if (found.n_query > 4) {
          status = 403;
          message = "Suspended";
        }
      } else {
        status = 401;
        message = "Unauthorized";
      }
    }

    res = {
      "status": status,
      "message": message
    };
    return res;
  }
}
//# sourceMappingURL=auth-query.js.map