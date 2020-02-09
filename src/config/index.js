import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'development';
const secrets = {
  jwt: process.env.JWT_SECRET,
  jwtExp: 21600,
};
let databaseURL;

switch (env) {
  case 'development':
    databaseURL = process.env.DATABASE_URL;
    break;
  case 'test':
  case 'testing':
    databaseURL = process.env.TEST_DATABASE_URL;
    break;
  default:
    databaseURL = process.env.DATABASE_URL;
    break;
}

export default {
  port,
  env,
  secrets,
  databaseURL,
};
