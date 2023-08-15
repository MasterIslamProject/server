"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeTrendingQuery;

var _trending = _interopRequireDefault(require("./trending"));

var _errors = require("../helpers/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeTrendingQuery({
  database
}) {
  return Object.freeze({
    add,
    findById,
    findByCategory,
    getTrending,
    //deleteByTopic,
    deleteById,
    update
  });

  async function getTrending({
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

    return (await db.collection('Trending').find(query).sort({
      date: -1
    }).limit(Number(max)).toArray()).map(documentToTrending);
  }

  async function add({
    trendingId,
    ...trending
  }) {
    let date = new Date();
    trending.date = date.toISOString();
    const db = await database;

    if (trendingId) {
      trending._id = db.makeId(trendingId);
    }

    const {
      result,
      ops
    } = await db.collection('Trending').insertOne(trending).catch(mongoError => {
      const [errorCode] = mongoError.message.split(' ');

      if (errorCode === 'E11000') {
        const [_, mongoIndex] = mongoError.message.split(':')[2].split(' ');
        throw new _errors.UniqueConstraintError();
      }

      throw mongoError;
    });
    return {
      success: result.ok === 1,
      created: documentToTrending(ops[0])
    };
  }

  async function update({
    id,
    ...trending
  }) {
    const db = await database;
    const query = {
      _id: db.makeId(id)
    };
    const newSet = {
      $set: {
        topic: trending.category,
        caption: trending.caption,
        thumbnail: trending.banner,
        num_response: trending.num_response,
        video: trending.video,
        type: trending.type,
        keywords: trending.keywords
      }
    };
    /*if (id) {
      _id = db.makeId(id)
    }*/

    const {
      result
    } = await db.collection('Trending').updateOne(query, newSet, {
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
    const found = await db.collection('Trending').findOne({
      _id: db.makeId(id)
    });

    if (found) {
      return documentToTrending(found);
    }

    return {};
  }

  async function findByCategory({
    category
  }) {
    const db = await database;
    return (await db.collection('Trending').find({
      category: category
    }).sort({
      date: -1
    }).toArray()).map(documentToTrending);
  }

  async function deleteById({
    id
  }) {
    const db = await database;
    const {
      result
    } = await db.collection('Trending').deleteOne({
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

  function documentToTrending({
    _id: id,
    ...doc
  }) {
    return (0, _trending.default)({
      id,
      ...doc
    });
  }
}
//# sourceMappingURL=trending-query.js.map