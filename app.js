import express from 'express';
import morgan from 'morgan';
import { connect } from 'mongoose';
import restrictOrigin from './middlewares/restrictOrigin';
import { router } from './routes/users';

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

//mongoDb connection
connect(process.env.MONGO_URL)
  .then(() => {
    console.log('succesfully connected to mongoose....');
  })
  .catch((ex) => {
    console.log('Error in connection with exception: ', ex);
  })

//middlewares
app.use(express.json());
app.use(restrictOrigin);
app.use(morgan('dev'));

//APIs
app.get('/ping', (req, res) => {
  return res.send({
    status: 'healthy'
  });
});
app.use('/users', router)

app.listen(PORT, () => {
  console.log('server listening on PORT: ', PORT);
});

