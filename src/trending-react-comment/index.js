import makeDb from '../db';
import makeTrendingReactCommentQuery from './trending-react-comment-query';
import makeTrendingReactCommentEndpointHandler from './trending-react-comment-endpoint';

const database = makeDb();
const trendingReactCommentQuery = makeTrendingReactCommentQuery({ database });
const trendingReactCommentEndpointHandler = makeTrendingReactCommentEndpointHandler({ trendingReactCommentQuery });

export default trendingReactCommentEndpointHandler;