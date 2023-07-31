"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../db"));

var _trendingQuery = _interopRequireDefault(require("./trending-query"));

var _trendingEndpoint = _interopRequireDefault(require("./trending-endpoint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const database = (0, _db.default)();
const trendingQuery = (0, _trendingQuery.default)({
  database
});
const trendingEndpointHandler = (0, _trendingEndpoint.default)({
  trendingQuery
});
var _default = trendingEndpointHandler;
exports.default = _default;
//# sourceMappingURL=index.js.map