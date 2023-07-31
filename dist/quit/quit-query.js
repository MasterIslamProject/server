"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeQuitQuery;

var _quit = _interopRequireDefault(require("./quit"));

var _errors = require("../helpers/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeQuitQuery({
  database
}) {
  return Object.freeze({
    add,
    findById,
    getQuit,
    deleteById
  });

  async function getQuit({
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

    return (await db.collection('Quit').find(query).limit(Number(max)).toArray()).map(documentToQuit);
  }

  async function add({
    quitId,
    ...quit
  }) {
    const db = await database;

    if (quitId) {
      quit_id = db.makeId(quitId);
    }

    const {
      result,
      ops
    } = await db.collection('Quit').insertOne(quit).catch(mongoError => {
      const [errorCode] = mongoError.message.split(' ');

      if (errorCode === 'E11000') {
        const [_, mongoIndex] = mongoError.message.split(':')[2].split(' ');
        throw new _errors.UniqueConstraintError(mongoIndex === 'ContactEmailIndex' ? 'emailAddress' : 'contactId');
      }

      throw mongoError;
    });
    return {
      success: result.ok === 1,
      created: documentToQuit(ops[0])
    };
  }

  async function findById({
    id
  }) {
    const db = await database;
    const found = await db.collection('Quit').findOne({
      _id: db.makeId(id)
    });

    if (found) {
      return documentToQuit(found);
    }

    return {};
  }

  async function deleteById({
    id
  }) {
    const db = await database;
    const {
      result
    } = await db.collection('Quit').deleteOne({
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

  function documentToQuit({
    _id: id,
    ...doc
  }) {
    return (0, _quit.default)({
      id,
      ...doc
    });
  }
}
//# sourceMappingURL=quit-query.js.map