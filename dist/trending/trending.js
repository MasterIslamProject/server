"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeTrending;

var _requiredParam = _interopRequireDefault(require("../helpers/required-param"));

var _errors = require("../helpers/errors");

var _isValidEmail = _interopRequireDefault(require("../helpers/is-valid-email.js"));

var _upperFirst = _interopRequireDefault(require("../helpers/upper-first"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeTrending(trendingInfo = (0, _requiredParam.default)('trendingInfo')) {
  const validTrending = validate(trendingInfo);
  const normalTrending = normalize(validTrending);
  return Object.freeze(normalTrending);

  function validate({
    /*customer_id = requiredParam('customer_id'),
    payment_id = requiredParam('payment_id'),
    status = requiredParam('status'),*/
    ...otherInfo
  } = {}) {
    return { ...otherInfo
    };
  }
  /*function validateName (label, name) {
      if (name.length < 2) {
          throw new InvalidPropertyError(
          `Property's ${label} must be at least 2 characters long.`
          )
      }
  }*/


  function normalize({ ...otherInfo
  }) {
    return { ...otherInfo
    };
  }
}
//# sourceMappingURL=trending.js.map