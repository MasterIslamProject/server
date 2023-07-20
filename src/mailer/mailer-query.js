const nodemailer = require('nodemailer');
//const sgMail = require('@sendgrid/mail')

import makeMailer from './mailer'
import { UniqueConstraintError } from '../helpers/errors'

export default function makeMailerQuery({database}){
    return Object.freeze({
        add,
        getMessages
    });

    async function getMessages ({ max = 200000, before, after } = {}) {
        
        const db = await database;
        const query = {}
        if (before || after) {
        query._id = {}
        query._id = before ? { ...query._id, $lt: db.makeId(before) } : query._id
        query._id = after ? { ...query._id, $gt: db.makeId(after) } : query._id
        }
  
        return (await db
        .collection('Messages')
        .find(query)
        .limit(Number(max))
        .toArray()).map(documentToMailer)
      }
   
    async function add ({ mailerId, ...mailer }) {

        const db = await database
        if (mailerId) {
          mailer._id = db.makeId(mailerId)
        }
        const { result, ops } = await db
          .collection('Messages')
          .insertOne(mailer)
          .catch(mongoError => {
            const [errorCode] = mongoError.message.split(' ')
            if (errorCode === 'E11000') {
              const [_, mongoIndex] = mongoError.message.split(':')[2].split(' ')
              throw new UniqueConstraintError(
                
              )
            }
            throw mongoError
          })
          
        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //     user: 'thenaccproject@gmail.com',//'masterislamproject@gmail.com',
        //     pass: 'uwumygrocoicpiwy', //'lxoawljozobqbmuo',
        //     },
        // });

        let transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            secure: true,
            port: 465,
            auth: {
              user: 'no-reply@masterislam.com',
              pass: '!123Mi_contact',
            },
          });
         
         
        const mailerResult = await transporter.sendMail({
            from:  '"MasterIslam" <no-reply@masterislam.com>', // sender address
            to: mailer.send_to, // list of receivers
            subject: mailer.topic, // Subject line
            text: mailer.comment+"<br><br>"+mailer.send_as, // plain text body
            html: mailer.comment+"<br><br>"+mailer.send_as, // html body
            });

        
        if (mailerResult.messageId == null){

            return {
                status: "error",
                message: "Mail not sent"
            }
        }
        else {
            return {
                status: "success",
                message: "Mail sent"
            }
        }

    }

    function documentToMailer ({ _id: id, ...doc }) {
        return makeMailer({ id, ...doc })
      }

}




