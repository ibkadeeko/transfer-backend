import { User } from './model';

/**
 * Get user by ID
 * @param {string} id User ID
 *
 * @returns {Promise<Object | null>} User Details
 */
export const getUserById = async id => {
  const data = await User.findById(id).exec();
  return data;
};

/**
 * Get user by email
 * @param {string} email User email
 *
 * @returns {Promise<Object | null>} User Details
 */
export const getUserByEmail = async email => {
  const data = await User.findOne({ email }).exec();
  return data;
};

/**
 * Check if a user exists using their email
 *
 * @param {string} email  User email
 *
 * @returns {Promise<Object | null>} User Details
 */
export const checkUserExists = async email => {
  const data = await User.findOne({ email })
    .select({ email: 1 })
    .lean()
    .exec();
  return data;
};

/**
 * Get user by phone number
 * @param {string} phone User phone number
 *
 * @returns {Promise<Object | null>} User Details
 */
export const getUserByPhone = async phone => {
  const data = await User.findOne({ phone }).exec();
  return data;
};

/**
 * Gets all Users
 *
 * @returns {Promise<Array>} array of users
 */
export const getAllUsers = async () => {
  const data = await User.find({}).exec();
  return data;
};

/**
 * Creates a new user
 * @param {Object} userDetails Details for user to be created
 *
 * @returns {Promise<Object>} User Details
 */
export const createUser = async userDetails => {
  const data = await User.create(userDetails);
  const dataObject = data.toObject();
  delete dataObject.password;
  return dataObject;
};

/**
 * Delete user by ID
 * @param {string} id User ID
 *
 * @returns {Promise<Object | null>} User Details
 */
export const removeUserById = async id => {
  const data = await User.findByIdAndRemove(id).exec();
  return data;
};

/**
 * Update user details
 * @param {string} id User ID
 * @param {Object} update update details
 *
 * @returns {Promise<Object | null>} new user details
 */
export const updateUserById = async (id, update) => {
  const data = await User.findByIdAndUpdate(id, update, { new: true }).exec();
  return data;
};
