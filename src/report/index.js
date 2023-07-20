import makeDb from '../db';
import makeReportQuery from './report-query';
import makeReportEndpointHandler from './report-endpoint';

const database = makeDb();
const reportQuery = makeReportQuery({ database });
const reportEndpointHandler = makeReportEndpointHandler({ reportQuery });

export default reportEndpointHandler;