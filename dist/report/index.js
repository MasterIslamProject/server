"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../db"));

var _reportQuery = _interopRequireDefault(require("./report-query"));

var _reportEndpoint = _interopRequireDefault(require("./report-endpoint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const database = (0, _db.default)();
const reportQuery = (0, _reportQuery.default)({
  database
});
const reportEndpointHandler = (0, _reportEndpoint.default)({
  reportQuery
});
var _default = reportEndpointHandler;
exports.default = _default;
//# sourceMappingURL=index.js.map