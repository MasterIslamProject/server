import {
    UniqueConstraintError,
    InvalidPropertyError,
    RequiredParameterError
  } from '../helpers/errors';
  import makeHttpError from '../helpers/http-error';
  import makeTrending from './trending';

export default function makeTrendingEndpointHandler({trendingQuery}){
    return async function handle(httpRequest){
        switch (httpRequest.method) {
            case 'POST':
              return postTrending(httpRequest)
      
            case 'GET':
              return getTrending(httpRequest)
      
            case 'DELETE':
              return deleteTrending(httpRequest)

            default:
              return makeHttpError({
                statusCode: 405,
                errorMessage: `${httpRequest.method} method not allowed.`
              })
        }
    }

    async function getTrending (httpRequest) {

      const { id } = httpRequest.queryParams || {}
      const { category } = httpRequest.queryParams || {}
      const { max, before, after } = httpRequest.queryParams || {}

      if (category !== undefined ){
        
        const result = await trendingQuery.findByCategory({ category })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else if (id !== undefined ){
        
        const result = await trendingQuery.findById({ id })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else {
        const result = await trendingQuery.getTrending({ max, before, after })
        
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }
        
      }
        
    }

    async function postTrending (httpRequest) {
        let trendingInfo = httpRequest.body
        if (!trendingInfo) {
          return makeHttpError({
            statusCode: 400,
            errorMessage: 'Bad request. No POST body.'
          })
        }
    
        if (typeof httpRequest.body === 'string') {
          try {
            trendingInfo = JSON.parse(trendingInfo)
          } catch {
            return makeHttpError({
              statusCode: 400,
              errorMessage: 'Bad request. POST body must be valid JSON.'
            })
          }
        }
    
        try {

          if (httpRequest.path == '/trending/update'){
            
            const trending = makeTrending(trendingInfo)
            const result = await trendingQuery.update(trending)
            return {
              headers: {
                'Content-Type': 'application/json'
              },
              statusCode: 201,
              data: JSON.stringify(result)
            }
          }
          else {
            const trending = makeTrending(trendingInfo)
            const result = await trendingQuery.add(trending)
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


    async function deleteTrending (httpRequest) {
      const { id } = httpRequest.pathParams || {}
  
      try {
        const result = await trendingQuery.deleteById({ id })
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