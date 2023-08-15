import {
    UniqueConstraintError,
    InvalidPropertyError,
    RequiredParameterError
  } from '../helpers/errors';
  import makeHttpError from '../helpers/http-error';
  import makeTrendingReact from './trending-react';

export default function makeTrendingReactEndpointHandler({trendingReactQuery}){
    return async function handle(httpRequest){
        switch (httpRequest.method) {
            case 'POST':
              return postTrendingReact(httpRequest)
      
            case 'GET':
              return getTrendingReact(httpRequest)

            case 'PUT':
                return updateTrendingReact(httpRequest)
      
            case 'DELETE':
              return deleteTrendingReact(httpRequest)

            default:
              return makeHttpError({
                statusCode: 405,
                errorMessage: `${httpRequest.method} method not allowed.`
              })
        }
    }

    async function getTrendingReact (httpRequest) {

      const { id } = httpRequest.queryParams || {}
      const { category } = httpRequest.queryParams || {}
      const { trending_id } = httpRequest.queryParams || {}
      const { mentor_id } = httpRequest.queryParams || {}
      const { max, before, after } = httpRequest.queryParams || {}

      if (category !== undefined ){
        
        const result = await trendingReactQuery.findByCategory({ category })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else if (trending_id !== undefined ){
        
        const result = await trendingReactQuery.findByTrendingId({ trending_id })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else if (mentor_id !== undefined ){
        
        const result = await trendingReactQuery.findByMentorId({ mentor_id })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else if (id !== undefined ){
       
        const result = await trendingReactQuery.findById({ id })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else {
        const result = await trendingReactQuery.getTrendingReact({ max, before, after })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }
        
      }
        
    }

    async function postTrendingReact (httpRequest) {
        let trendingReactInfo = httpRequest.body
        if (!trendingReactInfo) {
          return makeHttpError({
            statusCode: 400,
            errorMessage: 'Bad request. No POST body.'
          })
        }
    
        if (typeof httpRequest.body === 'string') {
          try {
            trendingReactInfo = JSON.parse(trendingReactInfo)
          } catch {
            return makeHttpError({
              statusCode: 400,
              errorMessage: 'Bad request. POST body must be valid JSON.'
            })
          }
        }
    
        try {
          if (httpRequest.path == '/trending-react/add'){
            const trendingReact = makeTrendingReact(trendingReactInfo)
            const result = await trendingReactQuery.add(trendingReact)
            return {
              headers: {
                'Content-Type': 'application/json'
              },
              statusCode: 201,
              data: JSON.stringify(result)
            }
          }
          else if (httpRequest.path == '/trending-react/verify'){
            const result = await trendingReactQuery.verify(trendingReactInfo)
            return {
              headers: {
                'Content-Type': 'application/json'
              },
              statusCode: 201,
              data: JSON.stringify(result)
            }
          }
          else if (httpRequest.path == '/trending-react/update-mentor-password'){
            const trendingReact = makeTrendingReact(trendingReactInfo)
            const result = await trendingReactQuery.updateMentorPassword(trendingReact)
            return {
              headers: {
                'Content-Type': 'application/json'
              },
              statusCode: 201,
              data: JSON.stringify(result)
            }
          }
          else if (httpRequest.path == '/trending-react/update-mentor-picture'){
            const trendingReact = makeTrendingReact(trendingReactInfo)
            const result = await trendingReactQuery.updateMentorPicture(trendingReact)
            return {
              headers: {
                'Content-Type': 'application/json'
              },
              statusCode: 201,
              data: JSON.stringify(result)
            }
          }
          else {
            const trendingReact = makeTrendingReact(trendingReactInfo)
            const result = await trendingReactQuery.updateMentor(trendingReact)
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


    async function updateTrendingReact (httpRequest) {
        let trendingReactInfo = httpRequest.body
        if (!trendingReactInfo) {
          return makeHttpError({
            statusCode: 400,
            errorMessage: 'Bad request. No POST body.'
          })
        }
    
        if (typeof httpRequest.body === 'string') {
          try {
            trendingReactInfo = JSON.parse(trendingReactInfo)
          } catch {
            return makeHttpError({
              statusCode: 400,
              errorMessage: 'Bad request. POST body must be valid JSON.'
            })
          }
        }
    
        try {
          const trendingReact = makeTrendingReact(trendingReactInfo)
          const result = await trendingReactQuery.update(trendingReact)
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

    async function deleteTrendingReact (httpRequest) {
      const { id } = httpRequest.pathParams || {}
      const { trending_id } = httpRequest.pathParams || {}
  
      if (trending_id !== undefined ){
        try {
          const result = await trendingReactQuery.deleteByTrendingId({ trending_id })
  
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
      else {
        try {
          const result = await trendingReactQuery.deleteById({ id })
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
  

}