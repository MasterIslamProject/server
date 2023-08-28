import makeQuit from './quit'
import { UniqueConstraintError } from '../helpers/errors'

export default function makeQuitQuery({database}){
    return Object.freeze({
        add,
        findById,
        getQuit,
        deleteById
    });

    async function getQuit ({ max = 100, before, after } = {}) {
      
        const db = await database;
        const query = {};
        if (before || after) {
            query._id = {}
            query._id = before ? { ...query._id, $lt: db.makeId(before) } : query._id
            query._id = after ? { ...query._id, $gt: db.makeId(after) } : query._id
        }

        return (await db
        .collection('Quit')
        .find(query)
        .limit(Number(max))
        .toArray()).map(documentToQuit)
    }


    async function add ({ quitId, ...quit }) {
        let date = new Date()
        quit.date = date.toISOString()

        const db = await database
        if (quitId) {
          quit_id = db.makeId(quitId)
        }
        const { result, ops } = await db
          .collection('Quit')
          .insertOne(quit)
          .catch(mongoError => {
            const [errorCode] = mongoError.message.split(' ')
            if (errorCode === 'E11000') {
              const [_, mongoIndex] = mongoError.message.split(':')[2].split(' ')
              throw new UniqueConstraintError(
                mongoIndex === 'ContactEmailIndex' ? 'emailAddress' : 'contactId'
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
        .collection('Quit')
        .findOne({ _id: db.makeId(id) })
      if (found) {
        return documentToQuit(found)
      }
      return {}
    }


    async function deleteById ({ id }) {
      const db = await database

      const { result } = await db.collection('Quit').deleteOne({"_id": db.makeId(id)})
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

    function documentToQuit ({ _id: id, ...doc }) {
        return makeQuit({ id, ...doc })
    }
}