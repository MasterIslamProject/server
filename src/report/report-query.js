import makeReport from './report'
import { UniqueConstraintError } from '../helpers/errors'

export default function makeReportQuery({database}){
    return Object.freeze({
        postReport,
        findByReportCategory,
        findByReporterId,
        findByReporteeId,
        findById,
        getReport, 
        updateReport, 
        deleteByReporterId,
        deleteByReporteeId,
        deleteById
    });

    async function getReport ({ max = 20000, before, after } = {}) {
        const db = await database;
        const query = {}
        if (before || after) {
        query._id = {}
        query._id = before ? { ...query._id, $lt: db.makeId(before) } : query._id
        query._id = after ? { ...query._id, $gt: db.makeId(after) } : query._id
        }

        return (await db
        .collection('Reports')
        .find(query)
        .limit(Number(max))
        .toArray()).map(documentToReport)
    }


    async function postReport({ reportId, ...report }) {
      let date = new Date()
      report.date = date.toISOString()

        const db = await database
        if (reportId) {
          report._id = db.makeId(reportId)
        }
        
        return db.collection("Reports") 
          .insertOne(report)
          .then(result => {
            
            return {
              message: "Success",
              status: result.insertedId
            };
        }).catch(mongoError => {
          const [errorCode] = mongoError.message.split(' ')
              if (errorCode === 'E11000') {
                const [_, mongoIndex] = mongoError.message.split(':')[2].split(' ')
                throw new UniqueConstraintError(
                  //mongoIndex === 'ContactEmailIndex' ? 'emailAddress' : 'contactId'
                )
              }
              throw mongoError
        });

    }

    async function updateReport ({ id, ...report}) {
      let date = new Date()
      report.date = date.toISOString()

      const db = await database
      const query = {
        _id: db.makeId(id)
      }
      
      const newSet = {
        $set : {
          reporter_id: report.reporter_id,
          reporter_fullname: report.reporter_fullname,
          reporter_category: report.reporter_category,
          reporter_email: report.reporter_email,
          reportee_id: report.reportee_id,
          reportee_fullname: report.reportee_fullname,
          reportee_category: report.reportee_category,
          reportee_email: report.reportee_email,
          report_category: report.report_category,
          comment: report.comment,
          date: report.date
        } 
      }
      /*if (id) {
        _id = db.makeId(id)
      }*/
      const { result } = await db
        .collection('Reports')
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

    async function findById ({ id }) {
      
      const db = await database
      const found = await db
        .collection('Reports')
        .findOne({ _id: db.makeId(id) })
      if (found) {
        return documentToReport(found)
      }
      return {}
    }

    async function findByReporterId({ reporter_id }) {
      const db = await database;
      return (await db
        .collection('Reports')
        .find({ reporter_id: reporter_id })
        .toArray()).map(documentToReport)
    }

    async function findByReporteeId({ reportee_id }) {
      const db = await database;
      
      return (await db
        .collection('Reports')
        .find({ reportee_id: reportee_id })
        .toArray()).map(documentToReport)
    }

    async function findByReportCategory({ report_category }) {
      const db = await database;
      
      return (await db
        .collection('Reports')
        .find({ report_category: report_category })
        .toArray()).map(documentToReport)
    }


    async function deleteByReporterId ({ reporter_id }) {
      const db = await database

      const { result } = await db.collection('Reports').deleteMany({"reporter_id": reporter_id})
      return {
        success: result.n
      }
    }

    async function deleteByReporteeId ({ reportee_id }) {
      const db = await database

      const { result } = await db.collection('Reports').deleteMany({"reportee_id": reportee_id})
      return {
        success: result.n
      }
    }

    async function deleteById ({ id }) {
      const db = await database

      const { result } = await db.collection('Reports').deleteOne({"_id": db.makeId(id)})
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

    function documentToReport ({ _id: id, ...doc }) {
      return makeReport({ id, ...doc })
    }
}