import {
  UniqueConstraintError,
  InvalidPropertyError,
  RequiredParameterError
} from '../helpers/errors';
import makeHttpError from '../helpers/http-error';
import makeAuth from './auth';

export default function makeAuthEndpointHandler({authQuery}){
 
  return async function handle(httpRequest){
    switch (httpRequest.method) {
        
        case 'GET':
          return getAllHeaders(httpRequest)

        case 'POST':
          return getAllHeaders(httpRequest)

        case 'DELETE':
          return getAllHeaders(httpRequest)

        default:
          return makeHttpError({
            statusCode: 405,
            errorMessage: `${httpRequest.method} method not allowed.`
          })
    }
  }
  


  async function getAllHeaders (httpRequest) { 
    
    const { email } = httpRequest.queryParams || {} 
    const { verifyemail } = httpRequest.queryParams || {} 
    var token = httpRequest.headers.authorization

    // console.log("The token: "+token)

    if(verifyemail || token == "Bearer -1"){
      
      const res = {
        "status": 200,
        "message": "Token not needed",
      }
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: res.status,
        data: JSON.stringify(res)
      }
    }
    
    else {

      var token = httpRequest.headers.authorization

      if(token == undefined){
        const res = {
          "status": 500,
          "message": "No token supplied",
        }
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: res.status,
          data: JSON.stringify(res)
        }
      }
      else {
        if (email !== undefined ){
          const result = await authQuery.checkToken(token, email)
          return {
            headers: {
              'Content-Type': 'application/json'
            },
            statusCode: 200,
            data: JSON.stringify(result)
          }

        }
        else {
          const result = await authQuery.findByHeader(token);
          return {
            headers: {
              'Content-Type': 'application/json'
            },
            statusCode: result.status,
            data: JSON.stringify(result)
          }

        }
      }
        
    }

  }

}