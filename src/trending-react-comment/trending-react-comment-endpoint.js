import {
    UniqueConstraintError,
    InvalidPropertyError,
    RequiredParameterError
  } from '../helpers/errors';
  import makeHttpError from '../helpers/http-error';
  import makeTrendingReactComment from './trending-react-comment';

export default function makeTrendingReactCommentEndpointHandler({trendingReactCommentQuery}){
    return async function handle(httpRequest){
        switch (httpRequest.method) {
            case 'POST':
              return postTrendingReactComment(httpRequest)
      
            case 'GET':
              return getTrendingReactComment(httpRequest)
           
      
            case 'DELETE':
              return deleteTrendingReactComment(httpRequest)

            default:
              return makeHttpError({
                statusCode: 405,
                errorMessage: `${httpRequest.method} method not allowed.`
              })
        }
    }

    async function getTrendingReactComment (httpRequest) {

      const { id } = httpRequest.queryParams || {}
      const { react_id } = httpRequest.queryParams || {}
      const { comment_id } = httpRequest.queryParams || {}
      const { r_id } = httpRequest.queryParams || {}
      const { c_id } = httpRequest.queryParams || {}
      const { statux } = httpRequest.queryParams || {}
      const { status } = httpRequest.queryParams || {}
      const { max, before, after } = httpRequest.queryParams || {}

      if (react_id !== undefined ){
        
        const result = await trendingReactCommentQuery.findByReactId({ react_id })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else if (comment_id !== undefined ){
        
        const result = await trendingReactCommentQuery.findByCommentId({ comment_id })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else if (id !== undefined ){
        
        const result = await trendingReactCommentQuery.findById({ id })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else if (r_id !== undefined && statux !== undefined){
        
        const result = await trendingReactCommentQuery.findByReactStatus({ r_id, statux })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else if (c_id !== undefined && statux !== undefined){
        
        const result = await trendingReactCommentQuery.findByCommentStatus({ r_id, statux })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }

      }
      else {
        const result = await trendingReactCommentQuery.getTrendingReactComment({ max, before, after })

        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 200,
          data: JSON.stringify(result)
        }
        
      }

        
    }


    async function postTrendingReactComment (httpRequest) {
        let trendingReactCommentInfo = httpRequest.body
        if (!trendingReactCommentInfo) {
          return makeHttpError({
            statusCode: 400,
            errorMessage: 'Bad request. No POST body.'
          })
        }
    
        if (typeof httpRequest.body === 'string') {
          try {
            trendingReactCommentInfo = JSON.parse(trendingReactCommentInfo)
          } catch {
            return makeHttpError({
              statusCode: 400,
              errorMessage: 'Bad request. POST body must be valid JSON.'
            })
          }
        }
    
        try {
          if (httpRequest.path == '/trending-react-comment/add'){
            const trendingReactComment = makeTrendingReactComment(trendingReactCommentInfo)
            const result = await trendingReactCommentQuery.add(trendingReactComment)
            return {
              headers: {
                'Content-Type': 'application/json'
              },
              statusCode: 201,
              data: JSON.stringify(result)
            }
          }
          else if (httpRequest.path == '/trending-react-comment/update-picture'){
            const trendingReactComment = makeTrendingReactComment(trendingReactCommentInfo)
            const result = await trendingReactCommentQuery.updatePicture(trendingReactComment)
            return {
              headers: {
                'Content-Type': 'application/json'
              },
              statusCode: 201,
              data: JSON.stringify(result)
            }
          }
          else if (httpRequest.path == '/trending-react-comment/update-password'){
            const trendingReactComment = makeTrendingReactComment(trendingReactCommentInfo)
            const result = await trendingReactCommentQuery.updatePassword(trendingReactComment)
            return {
              headers: {
                'Content-Type': 'application/json'
              },
              statusCode: 201,
              data: JSON.stringify(result)
            }
          }
          else {
            const trendingReactComment = makeTrendingReactComment(trendingReactCommentInfo)
            const result = await trendingReactCommentQuery.updateUser(trendingReactComment)
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



    async function deleteTrendingReactComment (httpRequest) {
      const { id } = httpRequest.pathParams || {}
      const { comment_id } = httpRequest.pathParams || {}
  
      if (id !== undefined ){
        
        try {
          const result = await trendingReactCommentQuery.deleteById({ id })
  
          return {
            headers: {
              'Content-Type': 'application/json'
            },
            statusCode: 200,
            data: JSON.stringify(result)
          }
        }
        catch (e){
          console.log("Error delete: "+e )
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
      else if (comment_id !== undefined){
        try {
          const result = await trendingReactCommentQuery.deleteByCommentId({ comment_id })
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