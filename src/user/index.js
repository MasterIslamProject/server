
import makeDb from '../db';
import makeUserQuery from './user-query';
import makeUserEndpointHandler from './user-endpoint';

const database = makeDb();
const userQuery = makeUserQuery({database});
const userEndpointHandler = makeUserEndpointHandler({ userQuery });

export default userEndpointHandler;