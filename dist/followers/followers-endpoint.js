"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeFollowersEndpointHandler;

var _errors = require("../helpers/errors");

var _httpError = _interopRequireDefault(require("../helpers/http-error"));

var _followers = _interopRequireDefault(require("./followers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeFollowersEndpointHandler({
  followersQuery
}) {
  return async function handle(httpRequest) {
    switch (httpRequest.method) {
      case 'POST':
        return postFollowers(httpRequest);

      case 'GET':
        return getFollowers(httpRequest);

      case 'PUT':
        return updateFollowers(httpRequest);

      case 'DELETE':
        return deleteFollowers(httpRequest);

      default:
        return (0, _httpError.default)({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`
        });
    }
  };

  async function getFollowers(httpRequest) {
    const {
      id
    } = httpRequest.queryParams || {};
    const {
      mid
    } = httpRequest.queryParams || {};
    const {
      memid
    } = httpRequest.queryParams || {};
    const {
      m_id,
      mem_id
    } = httpRequest.queryParams || {};
    const {
      max,
      before,
      after
    } = httpRequest.queryParams || {};

    if (mid !== undefined) {
      const result = await followersQuery.findByMentorId({
        mid
      });
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      };
    } else if (memid !== undefined) {
      const result = await followersQuery.findByMemberId({
        memid
      });
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      };
    } else if (m_id !== undefined) {
      const result = await followersQuery.findByBoth({
        m_id,
        mem_id
      });
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      };
    } else if (id !== undefined) {
      const result = await followersQuery.findById({
        id
      });
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      };
    } else {
      const result = await followersQuery.getFollowers({
        max,
        before,
        after
      });
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      };
    }
  }

  async function postFollowers(httpRequest) {
    let followersInfo = httpRequest.body;

    if (!followersInfo) {
      return (0, _httpError.default)({
        statusCode: 400,
        errorMessage: 'Bad request. No POST body.'
      });
    }

    if (typeof httpRequest.body === 'string') {
      try {
        followersInfo = JSON.parse(followersInfo);
      } catch {
        return (0, _httpError.default)({
          statusCode: 400,
          errorMessage: 'Bad request. POST body must be valid JSON.'
        });
      }
    }

    try {
      if (httpRequest.path == '/follower/verify') {
        const followers = (0, _followers.default)(followersInfo);
        const result = await followersQuery.verify(followers);
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 201,
          data: JSON.stringify(result)
        };
      } else if (httpRequest.path == '/follower/update-member') {
        const followers = (0, _followers.default)(followersInfo);
        const result = await followersQuery.updateMember(followers);
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 201,
          data: JSON.stringify(result)
        };
      } else if (httpRequest.path == '/follower/update-member-picture') {
        const followers = (0, _followers.default)(followersInfo);
        const result = await followersQuery.updateMemberPicture(followers);
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 201,
          data: JSON.stringify(result)
        };
      } else if (httpRequest.path == '/follower/update-member-password') {
        const followers = (0, _followers.default)(followersInfo);
        const result = await followersQuery.updateMemberPassword(followers);
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 201,
          data: JSON.stringify(result)
        };
      } else if (httpRequest.path == '/follower/update-mentor') {
        const followers = (0, _followers.default)(followersInfo);
        const result = await followersQuery.updateMentor(followers);
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 201,
          data: JSON.stringify(result)
        };
      } else if (httpRequest.path == '/follower/update-mentor-picture') {
        const followers = (0, _followers.default)(followersInfo);
        const result = await followersQuery.updateMentorPicture(followers);
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 201,
          data: JSON.stringify(result)
        };
      } else if (httpRequest.path == '/follower/update-mentor-password') {
        const followers = (0, _followers.default)(followersInfo);
        const result = await followersQuery.updateMentorPassword(followers);
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 201,
          data: JSON.stringify(result)
        };
      } else {
        const followers = (0, _followers.default)(followersInfo);
        const result = await followersQuery.add(followers);
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 201,
          data: JSON.stringify(result)
        };
      }
    } catch (e) {
      return (0, _httpError.default)({
        errorMessage: e.message,
        statusCode: e instanceof _errors.UniqueConstraintError ? 409 : e instanceof _errors.InvalidPropertyError || e instanceof _errors.RequiredParameterError ? 400 : 500
      });
    }
  }

  async function updateFollowers(httpRequest) {
    let followersInfo = httpRequest.body;

    if (!followersInfo) {
      return (0, _httpError.default)({
        statusCode: 400,
        errorMessage: 'Bad request. No POST body.'
      });
    }

    if (typeof httpRequest.body === 'string') {
      try {
        followersInfo = JSON.parse(followersInfo);
      } catch {
        return (0, _httpError.default)({
          statusCode: 400,
          errorMessage: 'Bad request. POST body must be valid JSON.'
        });
      }
    }

    try {
      const followers = (0, _followers.default)(followersInfo);
      const result = await followersQuery.update(followers);
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 201,
        data: JSON.stringify(result)
      };
    } catch (e) {
      return (0, _httpError.default)({
        errorMessage: e.message,
        statusCode: e instanceof _errors.UniqueConstraintError ? 409 : e instanceof _errors.InvalidPropertyError || e instanceof _errors.RequiredParameterError ? 400 : 500
      });
    }
  }

  async function deleteFollowers(httpRequest) {
    const {
      id
    } = httpRequest.pathParams || {};
    const {
      mid
    } = httpRequest.pathParams || {};
    const {
      memid
    } = httpRequest.pathParams || {};
    const {
      member_id
    } = httpRequest.pathParams || {};
    const {
      mentor_id
    } = httpRequest.pathParams || {}; // const { customer_id } = httpRequest.pathParams || {}

    if (mid !== undefined) {
      try {
        const result = await followersQuery.deleteByUnfollow({
          mid,
          memid
        });
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        };
      } catch (e) {
        return (0, _httpError.default)({
          errorMessage: e.message,
          statusCode: e instanceof _errors.UniqueConstraintError ? 409 : e instanceof _errors.InvalidPropertyError || e instanceof _errors.RequiredParameterError ? 400 : 500
        });
      }
    } else if (member_id !== undefined) {
      try {
        const result = await followersQuery.deleteByMemberId({
          member_id
        });
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        };
      } catch (e) {
        return (0, _httpError.default)({
          errorMessage: e.message,
          statusCode: e instanceof _errors.UniqueConstraintError ? 409 : e instanceof _errors.InvalidPropertyError || e instanceof _errors.RequiredParameterError ? 400 : 500
        });
      }
    } else if (mentor_id !== undefined) {
      try {
        const result = await followersQuery.deleteByMentorId({
          mentor_id
        });
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        };
      } catch (e) {
        return (0, _httpError.default)({
          errorMessage: e.message,
          statusCode: e instanceof _errors.UniqueConstraintError ? 409 : e instanceof _errors.InvalidPropertyError || e instanceof _errors.RequiredParameterError ? 400 : 500
        });
      }
    } else {
      try {
        const result = await followersQuery.deleteById({
          id
        });
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        };
      } catch (e) {
        return (0, _httpError.default)({
          errorMessage: e.message,
          statusCode: e instanceof _errors.UniqueConstraintError ? 409 : e instanceof _errors.InvalidPropertyError || e instanceof _errors.RequiredParameterError ? 400 : 500
        });
      }
    }
  }
}
//# sourceMappingURL=followers-endpoint.js.map