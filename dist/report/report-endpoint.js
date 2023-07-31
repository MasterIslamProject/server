"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeReportEndpointHandler;

var _errors = require("../helpers/errors");

var _httpError = _interopRequireDefault(require("../helpers/http-error"));

var _report = _interopRequireDefault(require("./report"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeReportEndpointHandler({
  reportQuery
}) {
  return async function handle(httpRequest) {
    switch (httpRequest.method) {
      case 'POST':
        return postReport(httpRequest);

      case 'GET':
        return getReport(httpRequest);

      case 'PUT':
        return updateReport(httpRequest);

      case 'DELETE':
        return deleteReport(httpRequest);

      default:
        return (0, _httpError.default)({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`
        });
    }
  };

  async function getReport(httpRequest) {
    const {
      id
    } = httpRequest.queryParams || {};
    const {
      report_category
    } = httpRequest.queryParams || {};
    const {
      reporter_id
    } = httpRequest.queryParams || {};
    const {
      reportee_id
    } = httpRequest.queryParams || {};
    const {
      max,
      before,
      after
    } = httpRequest.queryParams || {};

    if (report_category !== undefined) {
      const result = await reportQuery.findByReportCategory({
        report_category
      });
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      };
    } else if (reporter_id !== undefined) {
      const result = await reportQuery.findByReporterId({
        reporter_id
      });
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      };
    } else if (reportee_id !== undefined) {
      const result = await reportQuery.findByReporteeId({
        reportee_id
      });
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      };
    } else if (id !== undefined) {
      const result = await reportQuery.findById({
        id
      });
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      };
    } else {
      const result = await reportQuery.getReport({
        max,
        before,
        after
      });
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      };
    }
  }

  async function postReport(httpRequest) {
    let reportInfo = httpRequest.body;

    if (!reportInfo) {
      return (0, _httpError.default)({
        statusCode: 400,
        errorMessage: 'Bad request. No POST body.'
      });
    }

    if (typeof httpRequest.body === 'string') {
      try {
        reportInfo = JSON.parse(reportInfo);
      } catch {
        return (0, _httpError.default)({
          statusCode: 400,
          errorMessage: 'Bad request. POST body must be valid JSON.'
        });
      }
    }

    try {
      const report = (0, _report.default)(reportInfo);
      const result = await reportQuery.postReport(report);
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 201,
        data: JSON.stringify(result)
      };
    } catch (e) {
      return (0, _httpError.default)({
        errorMessage: e.message,
        statusCode: e instanceof _errors.UniqueConstraintError ? 409 : e instanceof _errors.InvalidPropertyError || e instanceof _errors.RequiredParameterError ? 400 : 500
      });
    }
  }

  async function updateReport(httpRequest) {
    let reportInfo = httpRequest.body;

    if (!reportInfo) {
      return (0, _httpError.default)({
        statusCode: 400,
        errorMessage: 'Bad request. No POST body.'
      });
    }

    if (typeof httpRequest.body === 'string') {
      try {
        reportInfo = JSON.parse(reportInfo);
      } catch {
        return (0, _httpError.default)({
          statusCode: 400,
          errorMessage: 'Bad request. POST body must be valid JSON.'
        });
      }
    }

    try {
      const report = (0, _report.default)(reportInfo);
      const result = await reportQuery.update(report);
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 201,
        data: JSON.stringify(result)
      };
    } catch (e) {
      return (0, _httpError.default)({
        errorMessage: e.message,
        statusCode: e instanceof _errors.UniqueConstraintError ? 409 : e instanceof _errors.InvalidPropertyError || e instanceof _errors.RequiredParameterError ? 400 : 500
      });
    }
  }

  async function deleteReport(httpRequest) {
    const {
      id
    } = httpRequest.pathParams || {};
    const {
      reporter_id
    } = httpRequest.pathParams || {};
    const {
      reportee_id
    } = httpRequest.pathParams || {};

    if (reporter_id !== undefined) {
      try {
        const result = await reportQuery.deleteByReporterId({
          reporter_id
        });
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        };
      } catch (e) {
        return (0, _httpError.default)({
          errorMessage: e.message,
          statusCode: e instanceof _errors.UniqueConstraintError ? 409 : e instanceof _errors.InvalidPropertyError || e instanceof _errors.RequiredParameterError ? 400 : 500
        });
      }
    } else if (reportee_id !== undefined) {
      try {
        const result = await reportQuery.deleteByReporteeId({
          reportee_id
        });
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        };
      } catch (e) {
        return (0, _httpError.default)({
          errorMessage: e.message,
          statusCode: e instanceof _errors.UniqueConstraintError ? 409 : e instanceof _errors.InvalidPropertyError || e instanceof _errors.RequiredParameterError ? 400 : 500
        });
      }
    } else {
      try {
        const result = await reportQuery.deleteById({
          id
        });
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        };
      } catch (e) {
        return (0, _httpError.default)({
          errorMessage: e.message,
          statusCode: e instanceof _errors.UniqueConstraintError ? 409 : e instanceof _errors.InvalidPropertyError || e instanceof _errors.RequiredParameterError ? 400 : 500
        });
      }
    }
  }
}
//# sourceMappingURL=report-endpoint.js.map