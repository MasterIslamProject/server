import makeDb from '../db';
import makeTrendingQuery from './trending-query';
import makeTrendingEndpointHandler from './trending-endpoint';

const database = makeDb();
const trendingQuery = makeTrendingQuery({ database });
const trendingEndpointHandler = makeTrendingEndpointHandler({ trendingQuery });

export default trendingEndpointHandler;