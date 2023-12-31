"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeQuit;

var _requiredParam = _interopRequireDefault(require("../helpers/required-param"));

var _errors = require("../helpers/errors");

var _isValidEmail = _interopRequireDefault(require("../helpers/is-valid-email.js"));

var _upperFirst = _interopRequireDefault(require("../helpers/upper-first"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeQuit(quitInfo = (0, _requiredParam.default)('quitInfo')) {
  const validQuit = validate(quitInfo);
  const normalQuit = normalize(validQuit);
  return Object.freeze(normalQuit);

  function validate({ // name = requiredParam('name'),
    // email = requiredParam('email'),
    // phone = requiredParam('phone'),
    // message = requiredParam('message'),
    ...otherInfo
  } = {}) {
    // validateName('name', name);
    return { ...otherInfo
    };
  }

  function validateName(label, name) {
    if (name.length < 2) {
      throw new _errors.InvalidPropertyError(`Contact ${label} must be at least 2 characters long.`);
    }
  }

  function normalize({ ...otherInfo
  }) {
    return { ...otherInfo
    };
  }
}
//# sourceMappingURL=quit.js.map