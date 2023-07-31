"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../db"));

var _userQuery = _interopRequireDefault(require("./user-query"));

var _userEndpoint = _interopRequireDefault(require("./user-endpoint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const database = (0, _db.default)();
const userQuery = (0, _userQuery.default)({
  database
});
const userEndpointHandler = (0, _userEndpoint.default)({
  userQuery
});
var _default = userEndpointHandler;
exports.default = _default;
//# sourceMappingURL=index.js.map