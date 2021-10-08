import { connect } from "mongoose";

/**
 * method to establish connection to db
 */
export const establishDbConnection = () => {
  connect(process.env.MONGO_URL)
    .then(() => {
      console.log('succesfully connected to mongoose....');
    })
    .catch((ex) => {
      console.log('Error in connection with exception: ', ex);
    })
}