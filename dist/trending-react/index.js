"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../db"));

var _trendingReactQuery = _interopRequireDefault(require("./trending-react-query"));

var _trendingReactEndpoint = _interopRequireDefault(require("./trending-react-endpoint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const database = (0, _db.default)();
const trendingReactQuery = (0, _trendingReactQuery.default)({
  database
});
const trendingReactEndpointHandler = (0, _trendingReactEndpoint.default)({
  trendingReactQuery
});
var _default = trendingReactEndpointHandler;
exports.default = _default;
//# sourceMappingURL=index.js.map