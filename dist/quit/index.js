"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../db"));

var _quitQuery = _interopRequireDefault(require("./quit-query"));

var _quitEndpoint = _interopRequireDefault(require("./quit-endpoint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const database = (0, _db.default)();
const quitQuery = (0, _quitQuery.default)({
  database
});
const quitEndpointHandler = (0, _quitEndpoint.default)({
  quitQuery
});
var _default = quitEndpointHandler;
exports.default = _default;
//# sourceMappingURL=index.js.map