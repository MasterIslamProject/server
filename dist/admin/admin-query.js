"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeAdminQuery;

var _admin = _interopRequireDefault(require("./admin"));

var _errors = require("../helpers/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

function makeAdminQuery({
  database
}) {
  return Object.freeze({
    add,
    getAdmin,
    findById,
    findByEmail,
    auth,
    reset,
    deleteById
  });

  async function getAdmin({
    max = 100,
    before,
    after
  } = {}) {
    const db = await database;
    const query = {};

    if (before || after) {
      query._id = {};
      query._id = before ? { ...query._id,
        $lt: db.makeId(before)
      } : query._id;
      query._id = after ? { ...query._id,
        $gt: db.makeId(after)
      } : query._id;
    }

    return (await db.collection('Admin').find(query).limit(Number(max)).toArray()).map(documentToAdmin);
  }

  async function add({
    adminId,
    ...admin
  }) {
    const db = await database;

    if (adminId) {
      admin._id = db.makeId(adminId);
    }

    admin.password = bcrypt.hashSync(admin.password, 10);
    const found = await db.collection('Admin').findOne({
      email: admin.email
    });

    if (found) {
      return {
        status: "Error",
        message: "Email already exist"
      };
    }

    const {
      result,
      ops
    } = await db.collection('Admin').insertOne(admin).catch(mongoError => {
      const [errorCode] = mongoError.message.split(' ');

      if (errorCode === 'E11000') {
        const [_, mongoIndex] = mongoError.message.split(':')[2].split(' ');
        throw new _errors.UniqueConstraintError(mongoIndex === 'ContactEmailIndex' ? 'emailAddress' : 'contactId');
      }

      throw mongoError;
    });
    return {
      status: "Success",
      message: "Admin staff created"
    };
  }

  async function auth({
    email,
    password
  }) {
    const db = await database;
    const found = await db.collection('Admin').findOne({
      email: email
    });

    if (found) {
      const passwordValid = await bcrypt.compare(password, found.password);

      if (passwordValid) {
        const token = jwt.sign({
          password: password
        }, process.env.JWT_SECRET, {
          expiresIn: '1d'
        });
        return {
          token: token,
          status: "Login Successful",
          user: {
            "email": found.email,
            "department": found.department,
            "name": found.name
          }
        };
      } else {
        return {
          token: "Nil",
          status: "Password not match"
        };
      }
    } else {
      return {
        token: "Nil",
        status: "Email not found"
      };
    }
  }

  async function reset({
    id,
    ...admin
  }) {
    const db = await database;
    const query = {
      _id: db.makeId(id)
    };
    const newSet = {
      $set: {
        email: admin.email,
        password: bcrypt.hashSync(admin.password, 10),
        name: admin.name,
        phone: admin.phone,
        department: admin.department,
        date: admin.date
      }
    };
    /*if (id) {
      _id = db.makeId(id)
    }*/

    const {
      result
    } = await db.collection('Admin').updateOne(query, newSet, {
      upsert: true
    });

    if (result) {
      return {
        status: "success",
        message: "Reset successfully"
      };
    } else {
      return {
        status: "error",
        message: "Error updating"
      };
    }
  }

  async function findById({
    id
  }) {
    const db = await database;
    const found = await db.collection('Admin').findOne({
      _id: db.makeId(id)
    });

    if (found) {
      return documentToAdmin(found);
    }

    return null;
  }

  async function findByEmail({
    email
  }) {
    const db = await database;
    const found = await db.collection('Admin').findOne({
      email: email
    });

    if (found) {
      return documentToAdmin(found);
    }

    return null;
  }

  async function deleteById({
    id
  }) {
    const db = await database;
    const {
      result
    } = await db.collection('Admin').deleteMany({
      "_id": db.makeId(id)
    });
    return {
      success: result.n
    };
  }

  function documentToAdmin({
    _id: id,
    ...doc
  }) {
    return (0, _admin.default)({
      id,
      ...doc
    });
  }
}
//# sourceMappingURL=admin-query.js.map