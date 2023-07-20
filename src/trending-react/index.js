import makeDb from '../db';
import makeTrendingReactQuery from './trending-react-query';
import makeTrendingReactEndpointHandler from './trending-react-endpoint';

const database = makeDb();
const trendingReactQuery = makeTrendingReactQuery({ database });
const trendingReactEndpointHandler = makeTrendingReactEndpointHandler({ trendingReactQuery });

export default trendingReactEndpointHandler;