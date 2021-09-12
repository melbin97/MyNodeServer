import Joi from "joi";
import { encryptPassword } from "../helpers/password.helper";
import { User } from "./user.model";
const { v4: uuid } = require("uuid");

require('dotenv').config();

/**
 * user data validation
 */
const userSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string().required().min(4),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
})

/**
 * method to facilitate sign up process
 * 
 * @param {*} req api request
 * @param {*} res api response
 * @returns 
 */
export const signUp = async (req, res) => {
  try {
    console.log('started processing sign up request....')
    const result = userSchema.validate(req.body)
    if (result.error) {
      console.log(result.error.message)
      return res.json({
        error: true,
        status: 400,
        message: result.error.message
      })
    }
    var user = await User.findOne({
      email: result.value.email
    })

    if (user) {
      console.log('Email currently in use')
      return res.json({
        error: true,
        message: 'Email currently in use'
      })
    }
    const hashedPassword = await encryptPassword(result.value.password)
    const id = uuid()

    delete result.value.confirmPassword
    result.value.id = id,
    result.value.password = hashedPassword

    const newUser = new User(result.value)
    await newUser.save();
    return res.json({
      success: true,
      message: 'Registration success'
    })
  } catch (error) {
    console.log('Handle errors: ', error)
    return res.json({
      error: true,
      message: 'signup error'
    })
  }
}