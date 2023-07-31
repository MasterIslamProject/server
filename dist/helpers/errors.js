"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthorizationError = exports.RequiredParameterError = exports.InvalidPropertyError = exports.UniqueConstraintError = void 0;

class UniqueConstraintError extends Error {
  constructor(value) {
    super(`${value} must be unique.`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UniqueConstraintError);
    }
  }

}

exports.UniqueConstraintError = UniqueConstraintError;

class InvalidPropertyError extends Error {
  constructor(msg) {
    super(msg);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPropertyError);
    }
  }

}

exports.InvalidPropertyError = InvalidPropertyError;

class RequiredParameterError extends Error {
  constructor(param) {
    super(`${param} can not be null or undefined.`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequiredParameterError);
    }
  }

}

exports.RequiredParameterError = RequiredParameterError;

class AuthorizationError extends Error {
  constructor(desc, error) {
    super(`${error}: ${desc}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequiredParameterError);
    }
  }

}

exports.AuthorizationError = AuthorizationError;
//# sourceMappingURL=errors.js.map