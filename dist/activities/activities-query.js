"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeActivitiesQuery;

var _activities = _interopRequireDefault(require("./activities"));

var _errors = require("../helpers/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeActivitiesQuery({
  database
}) {
  return Object.freeze({
    add,
    findById,
    findByCategory,
    findByPassword,
    findByCatnPass,
    getActivities,
    deleteByPassword,
    deleteById,
    update
  });

  async function getActivities({
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

    return (await db.collection('Activities').find(query).limit(Number(max)).toArray()).map(documentToActivities);
  }

  async function add({
    activitiesId,
    ...activities
  }) {
    let date = new Date();
    activities.date = date.toISOString();
    const db = await database;

    if (activitiesId) {
      activities._id = db.makeId(activitiesId);
    }

    const {
      result,
      ops
    } = await db.collection('Activities').insertOne(activities).catch(mongoError => {
      const [errorCode] = mongoError.message.split(' ');

      if (errorCode === 'E11000') {
        const [_, mongoIndex] = mongoError.message.split(':')[2].split(' ');
        throw new _errors.UniqueConstraintError();
      }

      throw mongoError;
    });

    if (result) {
      return {
        status: "Success",
        message: "Upload successful"
      };
    } else {
      return {
        status: "Error",
        message: "Upload not successful"
      };
    } // return {
    //     success: result.ok === 1,
    //     created: documentToActivities(ops[0])
    // }

  }

  async function update({
    id,
    ...activities
  }) {
    const db = await database;
    const query = {
      _id: db.makeId(id)
    };
    const newSet = {
      $set: {
        category: activities.category,
        topic: activities.topic,
        comment: activities.comment,
        banner: activities.banner,
        password: activities.password
      }
    };
    /*if (id) {
      _id = db.makeId(id)
    }*/

    const {
      result
    } = await db.collection('Activities').updateOne(query, newSet, {
      upsert: true
    });

    if (result) {
      return {
        status: "success",
        message: "Updated successfully"
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
    const found = await db.collection('Activities').findOne({
      _id: db.makeId(id)
    });

    if (found) {
      return documentToActivities(found);
    }

    return {};
  }

  async function findByCategory({
    category
  }) {
    const db = await database;
    return (await db.collection('Activities').find({
      category: category
    }).toArray()).map(documentToActivities);
  }

  async function findByPassword({
    password
  }) {
    const db = await database;
    return (await db.collection('Activities').find({
      password: password
    }).toArray()).map(documentToActivities);
  }

  async function findByCatnPass({
    category,
    password
  }) {
    const db = await database;
    return (await db.collection('Activities').find({
      category: category,
      password: password
    }).toArray()).map(documentToActivities);
  }

  async function deleteByPassword({
    password
  }) {
    const db = await database;
    const {
      result
    } = await db.collection('Activities').deleteMany({
      "password": password
    });
    return {
      success: result.n
    };
  }

  async function deleteById({
    id
  }) {
    const db = await database;
    const {
      result
    } = await db.collection('Activities').deleteOne({
      "_id": db.makeId(id)
    });

    if (result.n > 0) {
      return {
        status: "Success"
      };
    } else {
      return {
        status: "Error"
      };
    }
  }

  function documentToActivities({
    _id: id,
    ...doc
  }) {
    return (0, _activities.default)({
      id,
      ...doc
    });
  }
}
//# sourceMappingURL=activities-query.js.map