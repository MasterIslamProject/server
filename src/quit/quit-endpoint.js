import {
    UniqueConstraintError,
    InvalidPropertyError,
    RequiredParameterError
  } from '../helpers/errors';
  import makeHttpError from '../helpers/http-error';
  import makeQuit from './quit';

export default function makeQuitEndpointHandler({quitQuery}){
    return async function handle(httpRequest){
        switch (httpRequest.method) {
            case 'POST':
              return postQuit(httpRequest)
      
            case 'GET':
              return getQuit(httpRequest)

            case 'DELETE':
              return deleteQuit(httpRequest)

            default:
              return makeHttpError({
                statusCode: 405,
                errorMessage: `${httpRequest.method} method not allowed.`
              })
        }
    }

    async function getQuit (httpRequest) {
      const { id } = httpRequest.queryParams || {}
      const { max, before, after } = httpRequest.queryParams || {}

      if (id !== undefined ){
        const result = await quitQuery.findById({ id })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else {
      
        const result = await quitQuery.getQuit({ max, before, after })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }
        
      }
        
    }


    async function postQuit (httpRequest) {
      
        let quitInfo = httpRequest.body
        
        if (!quitInfo) {
          return makeHttpError({
            statusCode: 400,
            errorMessage: 'Bad request. No POST body.'
          })
        }
    
        if (typeof httpRequest.body === 'string') {
          try {
            quitInfo = JSON.parse(quitInfo)
          } catch {
            return makeHttpError({
              statusCode: 400,
              errorMessage: 'Bad request. POST body must be valid JSON.'
            })
          }
        }
    
        try {
          const quit = makeQuit(quitInfo)
          const result = await quitQuery.add(quit)
          return {
            headers: {
              'Content-Type': 'application/json'
            },
            statusCode: 201,
            data: JSON.stringify(result)
          }
        } catch (e) {
          return makeHttpError({
            errorMessage: e.message,
            statusCode:
              e instanceof UniqueConstraintError
                ? 409
                : e instanceof InvalidPropertyError ||
                  e instanceof RequiredParameterError
                  ? 400
                  : 500
          })
        }
    }

 
  async function deleteQuit (httpRequest) {
    const { id } = httpRequest.pathParams || {}
    
    try {
      const result = await quitQuery.deleteById({ id })

      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      }
    }
    catch (e){
      return makeHttpError({
        errorMessage: e.message,
        statusCode:
          e instanceof UniqueConstraintError
            ? 409
            : e instanceof InvalidPropertyError ||
              e instanceof RequiredParameterError
              ? 400
              : 500
      })

    }
    
  }


}