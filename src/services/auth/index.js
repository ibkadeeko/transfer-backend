import jwt from 'jsonwebtoken';

import config from '../../config';
import { createUser, getUserByEmail, getUserById } from '../../resources/users/DAL';
import { successResponse, errorResponse } from '../../utils/responseHandlers';

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  });
};

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

export const signup = async (request, response, next) => {
  try {
    const { firstName, lastName, email, phone, password } = request.body;
    const user = await createUser({ firstName, lastName, email, phone, password });
    const token = newToken(user);

    return successResponse(response, 'Successfully created user', 201, { token, user });
  } catch (error) {
    return errorResponse(next, error.message, 500);
  }
};

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    const user = await getUserByEmail(email);
    const isMatch = await user?.checkPassword(password);
    console.log('isMatch', isMatch);
    if (!isMatch) {
      return errorResponse(next, 'email and password do not match', 401);
    }
    console.log('isMatch', isMatch);
    const token = newToken(user);
    const userObject = user?.toObject();
    delete userObject.password;
    return successResponse(response, 'Successfully logged in', 200, { token, user: userObject });
  } catch (error) {
    return errorResponse(next, error.message, 500);
  }
};

export const protect = async (request, response, next) => {
  try {
    let token = request.headers['x-access-token'] || request.headers.authorization;
    if (!token) {
      return errorResponse(next, 'No token Provided', 401);
    }
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    const { id } = await verifyToken(token);
    const user = await getUserById(id);
    if (!user) {
      return errorResponse(next, 'Invalid Token Provided', 400);
    }
    request.user = user;
    next();
  } catch (error) {
    return errorResponse(next, 'Invalid Token Provided', 500);
  }
};
