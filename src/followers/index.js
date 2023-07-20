import makeDb from '../db';
import makeFollowersQuery from './followers-query';
import makeFollowersEndpointHandler from './followers-endpoint';

const database = makeDb();
const followersQuery = makeFollowersQuery({ database });
const followersEndpointHandler = makeFollowersEndpointHandler({ followersQuery });

export default followersEndpointHandler;