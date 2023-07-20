import makeDb from '../db' 
import makeQuitQuery from './quit-query'
import makeQuitEndpointHandler from './quit-endpoint'

const database = makeDb() 
const quitQuery = makeQuitQuery({ database })
const quitEndpointHandler = makeQuitEndpointHandler({ quitQuery })

export default quitEndpointHandler 