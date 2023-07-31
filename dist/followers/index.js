"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../db"));

var _followersQuery = _interopRequireDefault(require("./followers-query"));

var _followersEndpoint = _interopRequireDefault(require("./followers-endpoint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const database = (0, _db.default)();
const followersQuery = (0, _followersQuery.default)({
  database
});
const followersEndpointHandler = (0, _followersEndpoint.default)({
  followersQuery
});
var _default = followersEndpointHandler;
exports.default = _default;
//# sourceMappingURL=index.js.map