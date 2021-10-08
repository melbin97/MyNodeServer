import express from 'express';
import morgan from 'morgan';
import restrictOrigin from './middlewares/restrictOrigin';
import { router } from './routes/users';
import { establishDbConnection } from './src/helpers/dbHelper';

const app = express();
const PORT = process.env.PORT || 5000;

establishDbConnection()

//middlewares
app.use(express.json());
app.use(restrictOrigin);
app.use(morgan('dev'));

//routers
app.use('/users', router)

app.listen(PORT, () => {
  console.log('server listening on PORT: ', PORT);
});

