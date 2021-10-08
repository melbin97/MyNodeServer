
const bcrypt = require("bcryptjs");

/**
 * method to encrypt password
 * 
 * @param {*} password 
 * @returns encrypted password
 */
export const encryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
  } catch (error) {
    throw new Error('Hashing failed with error: ', error)
  }
}

/**
 * method to compare password
 * 
 * @param {*} inputPassword 
 * @param {*} encryptedPassword 
 * @returns boolean
 */
export const comparePassword = async (inputPassword, encryptedPassword) => {
  try {
    return await bcrypt.compare(inputPassword, encryptedPassword)
  } catch(error) {
    throw new Error('password comparison failed with error: ', error)
  }
}

/**
 * method to generate secret code
 * 
 * @returns secretcode
 */
export const generateSecretCode = () => {
  return Math.floor(100000 + Math.random() * 900000)
}