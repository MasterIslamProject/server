import makeTrendingReactComment from './trending-react-comment'
import { UniqueConstraintError } from '../helpers/errors'

const bcrypt = require('bcryptjs');

export default function makeTrendingReactCommentQuery({database}){
    return Object.freeze({
        add,
        updateUser,
        updatePicture,
        updatePassword,
        findById,
        findByReactId,
        findByCommentId,
        findByReactStatus,
        findByCommentStatus,
        getTrendingReactComment,
        deleteById,
        deleteByCommentId
    });

    async function getTrendingReactComment ({ max = 100, before, after } = {}) {
        const db = await database;
        const query = {}
        if (before || after) {
        query._id = {}
        query._id = before ? { ...query._id, $lt: db.makeId(before) } : query._id
        query._id = after ? { ...query._id, $gt: db.makeId(after) } : query._id
        }

        return (await db
        .collection('TrendingReactComment')
        .find(query)
        .sort( { date: -1 } )
        .limit(Number(max))
        .toArray()).map(documentToTrendingReactComment)
    }


    async function add ({ trendingReactCommentId, ...trendingReactComment }) {
        let date = new Date()
        // console.log(date.toISOString())

        trendingReactComment.date = date.toISOString()

        const db = await database
        if (trendingReactCommentId) {
          trendingReactComment._id = db.makeId(trendingReactCommentId)
        }
        const { result, ops } = await db
          .collection('TrendingReactComment')
          .insertOne(trendingReactComment)
          .catch(mongoError => {
            const [errorCode] = mongoError.message.split(' ')
            if (errorCode === 'E11000') {
              const [_, mongoIndex] = mongoError.message.split(':')[2].split(' ')
              throw new UniqueConstraintError(
                
              )
            }
            throw mongoError
          })
        
        if (result){
          return {
            status: "Success",
            message: "Upload successful"
          }
        }
        else {
          return {
            status: "Error",
            message: "Upload not successful"
          }
        }
        
    }
    
  async function findById ({ id }) {
    const db = await database
    const found = await db
      .collection('TrendingReactComment')
      .findOne({ _id: db.makeId(id) })
    if (found) {
      return documentToTrendingReactComment(found)
    }
    return {}
  }

  async function findByReactId({ react_id }) {
    const db = await database;
    
    return (await db
      .collection('TrendingReactComment')
      .find({ react_id: react_id })
      .sort( { date: -1 } )
      .toArray()).map(documentToTrendingReactComment)
  }

  async function findByReactStatus({ r_id, statux }) {
    const db = await database;
    
    return (await db
      .collection('TrendingReactComment')
      .find({ react_id: r_id, status: statux})
      .sort( { date: -1 } )
      .toArray()).map(documentToTrendingReactComment)
  }

  async function findByCommentStatus({ c_id, statux }) {
    const db = await database;
    
    return (await db
      .collection('TrendingReactComment')
      .find({ comment_id: c_id, status: statux})
      .sort( { date: -1 } )
      .toArray()).map(documentToTrendingReactComment)
  }

  async function findByCommentId({ comment_id }) {
    const db = await database;
    return (await db
      .collection('TrendingReactComment')
      .find({ comment_id: comment_id })
      .toArray()).map(documentToTrendingReactComment)
  }

  async function updateUser ({ password, ...trendingReactComment }) {
      
    const db = await database
    const query = {
      password: password
    }

    const newSet = {
      $set : {
        lastname: trendingReactComment.lastname,
        othernames: trendingReactComment.othernames
      } 
    }
    const { result } = await db
      .collection('TrendingReactComment')
      .updateMany(query, newSet)

      return {
        status: "success",
        message: result.n+" updated"
      }
  }

  async function updatePicture ({ password, ...trendingReactComment}) {
    const db = await database
    
    const query = {
      password: password
    }
    
    const newSet = {
      $set : {
        picture: trendingReactComment.picture
      } 
    }
    const { result } = await db
      .collection('TrendingReactComment')
      .updateMany(query, newSet)

      return {
        status: "success",
        message: result.n+" updated"
      }
    
  } 

  async function updatePassword ({ old_password, ...trendingReactComment}) {
    const db = await database
   
    const query = {
      password: old_password //bcrypt.hashSync(old_password, 10)
    }
    const newSet = {
      $set : {
        password: bcrypt.hashSync(trendingReactComment.new_password, 10)
      } 
    }
    
    const { result } = await db
      .collection('TrendingReactComment')
      .updateMany(query, newSet)

      return {
        status: "success",
        message: result.n+" updated"
      }
  }

  async function deleteById ({ id }) {
    const db = await database

    const { result } = await db.collection('TrendingReactComment').deleteOne({"_id": db.makeId(id)})
    if (result.n > 0){
      return {
        status: "Success"
      }
    }
    else {
      return {
        status: "Error"
      }
    }
  }

  async function deleteByCommentId ({ comment_id }) {
    const db = await database

    const { result } = await db.collection('TrendingReactComment').deleteMany({"comment_id": comment_id})
      return {
        status: result.n,
        message: "Success"
      }
    
  }

  function documentToTrendingReactComment ({ _id: id, ...doc }) {
    return makeTrendingReactComment({ id, ...doc })
  }
  
}