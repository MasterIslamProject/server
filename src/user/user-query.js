require('dotenv').config();
import makeUser from './user'
import { UniqueConstraintError } from '../helpers/errors'

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

export default function makeUserQuery({database}){
    return Object.freeze({
        add,
        getUser,
        findById,
        findByEmail,
        findVerifyEmail,
        findByCategory,
        auth,
        reset,
        verify,
        resetPassword,
        deleteById
    });

    async function getUser ({ max = 100, before, after } = {}) {
      
      const db = await database;
      const query = {}
      if (before || after) {
      query._id = {}
      query._id = before ? { ...query._id, $lt: db.makeId(before) } : query._id
      query._id = after ? { ...query._id, $gt: db.makeId(after) } : query._id
      }

      return (await db
      .collection('Users')
      .find(query)
      .limit(Number(max))
      .toArray()).map(documentToUser)
    }

    async function add ({ userId, ...user}) {
      let date = new Date()
      user.date = date.toISOString()

      const db = await database
      if (userId) {
        user._id = db.makeId(userId)
      }
      
      user.password = bcrypt.hashSync(user.password, 10);
      const found = await db
        .collection('Users')
        .findOne({ email: user.email })

      if (found) {
        return {
          status: "Error",
          message: "Email already exist"
        };
      }

      const { result, ops } = await db
        .collection('Users')
        .insertOne(user)
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
      return {
        status: "Success",
        message: "Successfully added"
      }
    }

    async function auth ({ email, password }) {

        email = email.toLowerCase()
        const db = await database
        const found = await db
          .collection('Users')   
          .findOne({ email: email })

        if (found) { 

          if(found.status == "Suspended"){
            return {
              token: "Nil",
              authUser: {},
              statusMsg: "Account Suspended"
            };
          }
          else {
            const passwordValid = await bcrypt.compare(password, found.password);
            
            if (passwordValid){
               
                const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
                    // expiresIn: '900000d'
                });
                return {
                    token: token,
                    statusMsg: "Login Successful",
                    authUser: {
                      id: found._id,
                      lastname: found.lastname,
                      othernames: found.othernames,
                      email: found.email,
                      location: found.location,
                      gender: found.gender,
                      token: found.token,
                      image: found.image,
                      category: found.category,
                      category_desc: found.category_desc,
                      password: found.password,
                      bio: found.bio,
                      date: found.date,
                      status: found.status,
                      n_query: found.n_query
                    }
                };
            }
            else {
                return {
                    token: "Nil",
                    authUser: {},
                    statusMsg: "Password not match"
                };
            }
          }
            
        }
        else {
            return {
                token: "Nil",
                authUser: {},
                statusMsg: "Email not found"
            }
            
        }
    }

    async function verify ({ oldpass, newpass }) {
      
      const inp_pass = bcrypt.hashSync(newpass, 10);
      const passwordValid = await bcrypt.compare(newpass, oldpass);

      if (passwordValid) {
        return {
          message: "Success",
          status: "Found"
        };
      }
      else {
        return {
          message: "Error",
          status: "Missing"
        }
      }

    }

    async function resetPassword ({ id, ...user }) {
      
        const passa = bcrypt.hashSync(user.password, 10);
        const db = await database
        const query = {
          _id: db.makeId(id)
        }

        const newSet = {
          $set : {
            lastname: user.lastname,
            othernames: user.othernames,
            email: user.email,
            location: user.location,
            gender: user.gender,
            token: user.token,
            image: user.image,
            category: user.category,
            category_desc: user.category_desc,
            password: bcrypt.hashSync(user.password, 10),
            bio: user.bio,
            status: user.status,
            n_query: user.n_query
          } 
        }
        /*if (id) {
          _id = db.makeId(id)
        }*/
        const { result } = await db
          .collection('Users')
          .updateOne(query, newSet, {upsert:true})
          

          if (result) {
            return {
              status: "success",
              message: passa //return the crypted password as message 
            }
          }
          else {
            return {
              status: "error",
              message: "Error updating"
            }
          }
        
    }

    async function reset ({ id, ...user }) {
      const db = await database
      const query = {
        _id: db.makeId(id)
      }
     
      const newSet = {
        $set : {
          lastname: user.lastname,
          othernames: user.othernames,
          email: user.email,
          location: user.location,
          gender: user.gender,
          token: user.token,
          image: user.image,
          category: user.category,
          category_desc: user.category_desc,
          password: user.password,
          bio: user.bio,
          status: user.status,
          n_query: user.n_query
        } 
      }
      /*if (id) {
        _id = db.makeId(id)
      }*/
      const { result } = await db
        .collection('Users')
        .updateOne(query, newSet, {upsert:true})
        

        if (result) {
          return {
            status: "success",
            message: "Reset successfully"
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
        .collection('Users')
        .findOne({ _id: db.makeId(id) })
      if (found) {
        return documentToUser(found)
      }
      return null
    }

  async function findByEmail ({ email }) {
    const db = await database
    const found = await db
      .collection('Users')
      .findOne({ email: email })
    if (found) {
      return documentToUser(found)
    }
    return {}
  }

  async function findVerifyEmail ({ verifyemail }) {
    console.log("verify email query: "+verifyemail)
    const db = await database
    const found = await db
      .collection('Users')
      .findOne({ email: verifyemail })
    if (found) {
      return {
        status: "Found",
        message: "Email exists"
      }
    }
    return {
      status: "Missing",
      message: "Email missing"
    }
  }

  async function findByCategory ({ category }) {
    const db = await database;

        return (await db
        .collection('Users')
        .find({category: category})
        .toArray()).map(documentToUser)

  }


  async function deleteById ({ id }) {
    const db = await database

    const { result } = await db.collection('Users').deleteOne({"_id": db.makeId(id)})
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

  function documentToUser ({ _id: id, ...doc }) {
    return makeUser({ id, ...doc })
  }
}