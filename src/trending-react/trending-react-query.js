import makeTrendingReact from './trending-react'
import { UniqueConstraintError } from '../helpers/errors'

export default function makeTrendingReactQuery({database}){
    return Object.freeze({
        add,
        verify,
        updateMentor,
        updateMentorPicture,
        updateMentorPassword,
        findById,
        findByCategory,
        findByTrendingId,
        findByMentorId,
        getTrendingReact,
        deleteByTrendingId,
        deleteById,
        update
    });

    async function getTrendingReact ({ max = 100, before, after } = {}) {
        const db = await database;
        const query = {}
        if (before || after) {
        query._id = {}
        query._id = before ? { ...query._id, $lt: db.makeId(before) } : query._id
        query._id = after ? { ...query._id, $gt: db.makeId(after) } : query._id
        }

        return (await db
        .collection('TrendingReact')
        .find(query)
        .limit(Number(max))
        .toArray()).map(documentToTrendingReact)
    }


    async function add ({ trendingReactId, ...trendingReact }) {
      
        const db = await database
        if (trendingReactId) {
          trendingReact._id = db.makeId(trendingReactId)
        }

        return db.collection("TrendingReact")
          .insertOne(trendingReact)
          .then(result => {
            //console.log(result.insertedId);
            return {
              // success: result.ok === 1,
              // id: result.insertedId
              status: "success",
              message: result.insertedId
            }
        }).catch(mongoError => {
          const [errorCode] = mongoError.message.split(' ')
              if (errorCode === 'E11000') {
                const [_, mongoIndex] = mongoError.message.split(':')[2].split(' ')
                throw new UniqueConstraintError(
                  mongoIndex === 'ContactEmailIndex' ? 'emailAddress' : 'contactId'
                )
              }
              throw mongoError
        });
        
    }

    async function verify ({ trendingReactInfo }) {
      
      const db = await database
      const found = await db
        .collection('TrendingReact')
        .findOne({ trending_id: trendingReactInfo.trending_id, mentor_id: trendingReactInfo.mentor_id })
      

      if (found) {
        return {
          message: "Success",
          status: "Found"
        };
      }
      else {
          return {
            message: "Error",
            status :"Null"
          }
      }
      
    }

  async function update ({ id, ...trendingReact }) {
      
      const db = await database
      const query = {
        _id: db.makeId(id)
      }

      const newSet = {
        $set : {
          trending_id: trendingReact.trending_id,
          mentor_id: trendingReact.mentor_id,
          mentor_lastname: trendingReact.mentor_lastname,
          mentor_othernames: trendingReact.mentor_othernames,
          description: trendingReact.description,
          picture: trendingReact.picture,
          category: trendingReact.category,
          video: trendingReact.video,
          type: trendingReact.type,
          caption: trendingReact.caption,
          password: trendingReact.password,
          date: trendingReact.date,
        } 
      }

      const { result } = await db
        .collection('TrendingReact')
        .updateOne(query, newSet, {upsert:true})

        if (result) {
          return {
            status: "success",
            message: "Updated successfully"
          }
        }
        else {
          return {
            status: "error",
            message: "Error updating"
          }
        }
      
  }

  async function updateMentor ({ password, ...trendingReact }) {
      
    const db = await database
    const query = {
      password: password
    }

    const newSet = {
      $set : {
        mentor_lastname: trendingReact.mentor_lastname,
        mentor_othernames: trendingReact.mentor_othernames
      } 
    }
    const { result } = await db
      .collection('TrendingReact')
      .updateMany(query, newSet)

      return {
        status: "success",
        message: result.n+" updated"
      }
    
  }

  async function updateMentorPicture ({ password, ...trendingReact }) {
    const db = await database
    const query = {
      password: password
    }

    const newSet = {
      $set : {
        picture: trendingReact.picture
      } 
    }
    const { result } = await db
      .collection('TrendingReact')
      .updateMany(query, newSet)

      return {
        status: "success",
        message: result.n+" updated"
      }
    
  }

  async function updateMentorPassword ({ old_password, ...trendingReact}) {
    const db = await database

    //oldpass = bcrypt.hashSync(old_password, 10);
    const query = {
      password: old_password
    }
    
    // const newSet = {
    //   $set : {
    //     password: bcrypt.hashSync(trendingReact.new_password, 10)
    //   } 
    // }
    const { result } = await db
      .collection('TrendingReact')
      .updateMany(query, {
        $set : {
          password: bcrypt.hashSync(trendingReact.new_password, 10)
        } 
      })

      return {
        status: "success",
        message: result.n+" updated"
      }
  }

    
  async function findById ({ id }) {
    
    const db = await database
    const found = await db
      .collection('TrendingReact')
      .findOne({ _id: db.makeId(id) })
    if (found) {
      return documentToTrendingReact(found)
    }
    return {}
  }

  async function findByCategory({ category }) {
    const db = await database;
    
    return (await db
      .collection('TrendingReact')
      .find({ category: category })
      .toArray()).map(documentToTrendingReact)
  }

  async function findByTrendingId({ trending_id }) {
    const db = await database;
    
    return (await db
      .collection('TrendingReact')
      .find({ trending_id: trending_id })
      .toArray()).map(documentToTrendingReact)
  }

  async function findByMentorId({ mentor_id }) {
    const db = await database;
    
    return (await db
      .collection('TrendingReact')
      .find({ mentor_id: mentor_id })
      .toArray()).map(documentToTrendingReact)
  }

  async function deleteByTrendingId ({ trending_id }) {
    const db = await database

    const { result } = await db.collection('TrendingReact').deleteMany({"trending_id": trending_id})
    return {
      success: result.n
    }
  }  


  async function deleteById ({ id }) {
    const db = await database

    const { result } = await db.collection('TrendingReact').deleteOne({"_id": db.makeId(id)})
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

  function documentToTrendingReact ({ _id: id, ...doc }) {
    return makeTrendingReact({ id, ...doc })
  }
}