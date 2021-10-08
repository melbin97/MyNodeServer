import Joi from "joi";
import { sendVerificationMail } from "../helpers/mailerService";
import { encryptPassword, generateSecretCode } from "../helpers/password.helper";
import { User } from "./user.model";
const { v4: uuid } = require("uuid");

require('dotenv').config();

/**
 * user data request
 */
const userSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string().required().min(4),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
})

/**
 * account activation request
 */
const accountActivationSchema = Joi.object().keys({
  secretCode: Joi.string().required(),
  email: Joi.string().required()
})

/**
 * method to facilitate sign up process
 * 
 * @param {*} req api request
 * @param {*} res api response
 * @returns JSON
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
    let code = generateSecretCode();
    let expiry = Date.now() + 60 * 1000 * 15

    const actionResult = await sendVerificationMail(result.value.email, `secret code is ${code}`)
    if (!actionResult) {
      console.log('mailing error!!')
      return res.json({
        error: true,
        message: 'mail error'
      })
    }
    result.value.secretCode = code
    result.value.secretCodeExpiry = expiry

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

/**
 * endpoint to facilitate login process
 * 
 * @param {*} req api request
 * @param {*} res api response
 * @returns JSON
 */
export const login = (req, res) => {
  return res.json({
    error: true,
    message: 'Not implemented'
  })
}

/**
 * endpoint to facilitate initial account activation
 * 
 * @param {*} req api request
 * @param {*} res api response
 */
export const activate = async (req, res) => {
  try {
    console.log('starting account activation process...')
    const result = accountActivationSchema.validate(req.body)
    if (result.error) {
      console.log('error-activation')
      return res.json({
        error: true,
        status: 400,
        message: result.error.message
      })
    }

    const user = await User.findOne({
      email: result.value.email,
      secretCode: result.value.secretCode,
      secretCodeExpiry:  { $gt: Date.now() }
    })

    if (!user) {
      console.log('no activation data found')
      return res.json({
        error: true,
        status: 400,
        message: 'User not found, try signing up again'
      })
    } else if (user.isActive) {
      console.log('user is already active')
      return res.json({
        error: true,
        status: 400,
        message: 'user already active'
      })
    }
    user.SecredCode = ''
    user.secretCodeExpiry = null
    user.isActive = true

    await user.save()
    await sendVerificationMail(user.email, 'Account succesfully activated')
    return res.status(200).json({
      success: true,
      message: "Account activated.",
    });
  } catch (error) {
    console.log(error)
    return res.json({
      error: true,
      status: 400,
      message: 'unknown error'
    })
  }
}

/**
 * method to resend OTP
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns JSON
 */
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.json({
        error: true,
        status: 400,
        message: 'email is required'
      })
    }
    const user = await User.findOne({
      email: email,
    })
    user.secretCode = generateSecretCode()
    user.secretCodeExpiry = Date.now() + 60 * 1000 * 15
    const actionResult = sendVerificationMail(email, user.secretCode)
    if (!actionResult) {
      console.log('mailing error!!')
      return res.json({
        error: true,
        message: 'mail error'
      })
    }
    await user.save()
    return res.json({
      success: true,
      message: 'Resending success'
    })
  } catch (error) {
    console.log(error)
    return res.json({
      success: false,
      message: 'failure'
    })
  }
}