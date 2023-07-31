"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../db"));

var _trendingReactCommentQuery = _interopRequireDefault(require("./trending-react-comment-query"));

var _trendingReactCommentEndpoint = _interopRequireDefault(require("./trending-react-comment-endpoint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const database = (0, _db.default)();
const trendingReactCommentQuery = (0, _trendingReactCommentQuery.default)({
  database
});
const trendingReactCommentEndpointHandler = (0, _trendingReactCommentEndpoint.default)({
  trendingReactCommentQuery
});
var _default = trendingReactCommentEndpointHandler;
exports.default = _default;
//# sourceMappingURL=index.js.map