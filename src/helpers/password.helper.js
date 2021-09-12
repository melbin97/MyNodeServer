
const bcrypt = require("bcryptjs");

export const encryptPassword = async(password) => {
    try {
      const salt = await bcrypt .genSalt(10)
      return await bcrypt.hash(password, salt)
    } catch (error) {
      throw new Error('Hashing failed with error: ', error)
    }
  }