import {
    UniqueConstraintError,
    InvalidPropertyError,
    RequiredParameterError
  } from '../helpers/errors';
  import makeHttpError from '../helpers/http-error';
  import makeUser from './user';

export default function makeUserEndpointHandler({userQuery}){
    return async function handle(httpRequest){
        switch (httpRequest.method) {
            case 'POST':
              return postUser(httpRequest)
      
            case 'GET':
              return getUser(httpRequest)
          
            case 'DELETE':
              return deleteUser(httpRequest)

            default:
              return makeHttpError({
                statusCode: 405,
                errorMessage: `${httpRequest.method} method not allowed.`
              })
        }
    }

    async function getUser (httpRequest) {

      const { id } = httpRequest.queryParams || {}
      const { email } = httpRequest.queryParams || {}
      const { verifyemail } = httpRequest.queryParams || {}
      const { category } = httpRequest.queryParams || {}
      const { max, before, after } = httpRequest.queryParams || {}

      if (email !== undefined){
        const result = await userQuery.findByEmail({ email })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      if (verifyemail !== undefined){
        const result = await userQuery.findVerifyEmail({ verifyemail })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else if (category !== undefined){
        const result = await userQuery.findByCategory({ category })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else if (id !== undefined ){
        const result = await userQuery.findById({ id })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else {
        const result = await userQuery.getUser({ max, before, after })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }
        
      }

    }

    async function postUser (httpRequest) {
      
        let userInfo = httpRequest.body
        if (!userInfo) {
          return makeHttpError({
            statusCode: 400,
            errorMessage: 'Bad request. No POST body.'
          })
        }
    
        if (typeof httpRequest.body === 'string') {
          try {
            userInfo = JSON.parse(userInfo)
          } catch {
            return makeHttpError({
              statusCode: 400,
              errorMessage: 'Bad request. POST body must be valid JSON.'
            })
          }
        }
    
        try { 
           
          if (httpRequest.path == '/user/auth'){
            
            const user = makeUser(userInfo);
            const result = await userQuery.auth(user);
            return {
                headers: {
                  'Content-Type': 'application/json'
                },
                statusCode: 201,
                data: JSON.stringify(result)
              }
          }
          else if (httpRequest.path == '/user/verify'){
            const result = await userQuery.verify(userInfo);
            return {
                headers: {
                  'Content-Type': 'application/json'
                },
                statusCode: 201,
                data: JSON.stringify(result)
              }
          }
          else if (httpRequest.path == '/user/reset'){
            const user = makeUser(userInfo);
            const result = await userQuery.reset(user);
            
            return {
                headers: {
                  'Content-Type': 'application/json'
                },
                statusCode: 201,
                data: JSON.stringify(result)
              }
          }
          
          else if (httpRequest.path == '/user/reset_password'){
          
            const user = makeUser(userInfo);
            const result = await userQuery.resetPassword(user);
            
            return {
              headers: {
                'Content-Type': 'application/json'
              },
              statusCode: 201,
              data: JSON.stringify(result)
            }
          }
          else {
            const user = makeUser(userInfo);
            const result = await userQuery.add(user);
            return {
                headers: {
                  'Content-Type': 'application/json'
                },
                statusCode: 201,
                data: JSON.stringify(result)
              }
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

    async function deleteUser (httpRequest) {
      //const { customer_id } = httpRequest.pathParams || {}
      const { id } = httpRequest.pathParams || {}
      try {
        const result = await userQuery.deleteById({ id })
  
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