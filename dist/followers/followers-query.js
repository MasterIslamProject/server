"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makefollowersQuery;

var _followers = _interopRequireDefault(require("./followers"));

var _errors = require("../helpers/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const bcrypt = require('bcryptjs');

function makefollowersQuery({
  database
}) {
  return Object.freeze({
    add,
    verify,
    updateMember,
    updateMemberPicture,
    updateMemberPassword,
    updateMentor,
    updateMentorPicture,
    updateMentorPassword,
    findByMentorId,
    findByMemberId,
    findByBoth,
    findById,
    getFollowers,
    deleteByMentorId,
    deleteByMemberId,
    deleteByUnfollow,
    deleteById,
    update
  });

  async function getFollowers({
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

    return (await db.collection('Followers').find(query).limit(Number(max)).toArray()).map(documentToFollowers);
  }

  async function add({
    followerId,
    ...followers
  }) {
    let date = new Date();
    followers.date = date.toISOString();
    const db = await database;

    if (followerId) {
      followers._id = db.makeId(followerId);
    }

    return db.collection("Followers").insertOne(followers).then(result => {
      // return {
      //   success: result.ok === 1,
      //   id: result.insertedId
      //   }
      return {
        message: "Success",
        status: result.insertedId
      };
    }).catch(mongoError => {
      const [errorCode] = mongoError.message.split(' ');

      if (errorCode === 'E11000') {
        const [_, mongoIndex] = mongoError.message.split(':')[2].split(' ');
        throw new _errors.UniqueConstraintError();
      }

      throw mongoError;
    });
  }

  async function verify(followers) {
    const db = await database;
    const found = await db.collection('Followers').findOne({
      user_id: followers.mem_id,
      mentor_id: followers.m_id
    });

    if (found) {
      return {
        message: "Success",
        status: "Found"
      };
    } else {
      return {
        message: "Error",
        status: "Null"
      };
    }
  }

  async function updateMember({
    password,
    ...follower
  }) {
    const db = await database;
    const query = {
      password: password
    };
    const newSet = {
      $set: {
        lastname: follower.lastname,
        othernames: follower.othernames,
        desc: follower.desc
      }
    };
    /*if (id) {
      _id = db.makeId(id)
    }*/

    const {
      result
    } = await db.collection('Followers').updateMany(query, newSet);
    return {
      status: "success",
      message: result.n + " updated"
    };
  }

  async function updateMemberPicture({
    password,
    ...follower
  }) {
    const db = await database;
    const query = {
      password: password
    };
    const newSet = {
      $set: {
        image: follower.image
      }
    };
    const {
      result
    } = await db.collection('Followers').updateMany(query, newSet);
    return {
      status: "success",
      message: result.n + " updated"
    };
  }

  async function updateMemberPassword({
    old_password,
    ...follower
  }) {
    const db = await database; //oldpass = bcrypt.hashSync(old_password, 10);

    const query = {
      password: old_password
    }; // const newSet = {
    //   $set : {
    //     password: bcrypt.hashSync(follower.new_password, 10)
    //   } 
    // }

    const {
      result
    } = await db.collection('Followers').updateMany(query, {
      $set: {
        password: bcrypt.hashSync(follower.new_password, 10)
      }
    });
    return {
      status: "success",
      message: result.n + " updated"
    };
  }

  async function updateMentor({
    mentor_password,
    ...follower
  }) {
    const db = await database;
    const query = {
      mentor_password: mentor_password
    };
    const newSet = {
      $set: {
        mentor_lastname: follower.mentor_lastname,
        mentor_othernames: follower.mentor_othernames,
        mentor_desc: follower.mentor_desc
      }
    };
    const {
      result
    } = await db.collection('Followers').updateMany(query, newSet);
    return {
      status: "success",
      message: result.n + " updated"
    };
  }

  async function updateMentorPicture({
    mentor_password,
    ...follower
  }) {
    const db = await database;
    const query = {
      mentor_password: mentor_password
    };
    const newSet = {
      $set: {
        mentor_image: follower.mentor_image
      }
    };
    const {
      result
    } = await db.collection('Followers').updateMany(query, newSet);
    return {
      status: "success",
      message: result.n + " updated"
    };
  }

  async function updateMentorPassword({
    old_password,
    ...follower
  }) {
    const db = await database; //oldpass = bcrypt.hashSync(old_password, 10);

    const query = {
      mentor_password: old_password
    }; // const newSet = {
    //   $set : {
    //     mentor_password: bcrypt.hashSync(follower.new_password, 10)
    //   } 
    // }

    const {
      result
    } = await db.collection('Followers').updateMany(query, {
      $set: {
        mentor_password: bcrypt.hashSync(follower.new_password, 10)
      }
    });
    return {
      status: "success",
      message: result.n + " updated"
    };
  }

  async function update({
    id,
    ...follower
  }) {
    const db = await database;
    const query = {
      _id: db.makeId(id)
    };
    const newSet = {
      $set: {
        mentor_id: follower.mentor_id,
        mentor_lastname: follower.mentor_lastname,
        mentor_othernames: follower.mentor_othernames,
        mentor_image: follower.mentor_image,
        mentor_password: follower.mentor_password,
        mentor_desc: follower.mentor_desc,
        user_id: follower.user_id,
        lastname: follower.lastname,
        othernames: follower.othernames,
        image: follower.image,
        password: follower.password,
        desc: follower.desc,
        date: follower.date
      }
    };
    /*if (id) {
      _id = db.makeId(id)
    }*/

    const {
      result
    } = await db.collection('Followers').updateOne(query, newSet, {
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
    const found = await db.collection('Followers').findOne({
      _id: db.makeId(id)
    });

    if (found) {
      return documentToFollowers(found);
    }

    return null;
  }

  async function findByMentorId({
    mid
  }) {
    const db = await database;
    return (await db.collection('Followers').find({
      mentor_id: mid
    }).toArray()).map(documentToFollowers);
  }

  async function findByMemberId({
    memid
  }) {
    const db = await database;
    return (await db.collection('Followers').find({
      user_id: memid
    }).toArray()).map(documentToFollowers);
  }

  async function findByBoth({
    m_id,
    mem_id
  }) {
    const db = await database;
    const found = await db.collection('Followers').findOne({
      user_id: mem_id,
      mentor_id: m_id
    });

    if (found) {
      return {
        message: "Success",
        status: "Found"
      };
    } else {
      return {
        message: "Error",
        status: "Null"
      };
    }
  }

  async function deleteByMentorId({
    mentor_id
  }) {
    const db = await database;
    const {
      result
    } = await db.collection('Followers').deleteMany({
      "mentor_id": mentor_id
    });
    return {
      success: result.n
    };
  }

  async function deleteByMemberId({
    member_id
  }) {
    const db = await database;
    const {
      result
    } = await db.collection('Followers').deleteMany({
      "user_id": member_id
    });
    return {
      success: result.n
    };
  }

  async function deleteByUnfollow({
    mid,
    memid
  }) {
    const db = await database;
    const {
      result
    } = await db.collection('Followers').deleteMany({
      "mentor_id": mid,
      "user_id": memid
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
    } = await db.collection('Followers').deleteOne({
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

  function documentToFollowers({
    _id: id,
    ...doc
  }) {
    return (0, _followers.default)({
      id,
      ...doc
    });
  }
}
//# sourceMappingURL=followers-query.js.map