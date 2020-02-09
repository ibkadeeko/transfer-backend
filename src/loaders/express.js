import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import config from '../config';
import routes from '../router';
import { successResponse, errorResponse } from '../utils/responseHandlers';

const isProduction = config.env === 'production';

const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(json());
app.use(morgan('dev'));
app.use(urlencoded({ extended: false }));

app.use('/api/v1', routes);

app.get('/', (req, res) => successResponse(res, 'Welcome to transfer API'));

app.all('*', (req, res, next) =>
  errorResponse(next, 'The Route you are requesting for does not exist', 404)
);

app.use((error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }
  console.log(error);
  return response.status(error.status >= 100 && error.status < 600 ? error.status : 500).send({
    status: 'error',
    error: error.message,
    ...(!isProduction && { trace: error.stack }),
  });
});

export default app;
