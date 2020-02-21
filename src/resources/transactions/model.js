import mongoose from 'mongoose';
import crypto from 'crypto';
import { getUserById, updateUserById } from '../users/DAL';

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'transfer'],
      required: true,
    },
    reference: {
      type: String,
      unique: true,
    },
    customer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
    },
    bank: {
      name: String,
      accountName: String,
      accountNumber: String,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true }
);

transactionSchema.pre('save', function(next) {
  /**
   * Generate a reference number based on transaction type
   * @param {string} type document type
   *
   * @returns {string} reference number
   */
  const generateId = type => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const getPrefix = {
      deposit: 'DEP',
      withdrawal: 'WID',
      transfer: 'TRF',
    };
    const prefix = getPrefix[type];

    let result = `${type}`;
    for (let i = 8; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    const uniqueString = crypto
      .createHash('sha256')
      .update(result, 'utf8')
      .digest('hex');

    return `${prefix}${uniqueString.toUpperCase()}`;
  };
  this.reference = generateId(this.type);
  next();
});

transactionSchema.pre('save', async function() {
  /**
   * Update User Accounts
   */
  const sender = await getUserById(this.createdBy);
  if (this.type === 'withdrawal') {
    const newBalance = sender.account.balance - this.amount;
    await updateUserById(this.createdBy, { account: { balance: newBalance } });
  }
  if (this.type === 'deposit') {
    const newBalance = sender.account.balance + this.amount;
    await updateUserById(this.createdBy, { account: { balance: newBalance } });
  }
  if (this.type === 'transfer') {
    const receiver = await getUserById(this.customer);
    const newReceiverBalance = receiver.account.balance + this.amount;
    const newSenderBalance = sender.account.balance - this.amount;
    await Promise.all([
      updateUserById(this.customer, { account: { balance: newReceiverBalance } }),
      updateUserById(this.createdBy, { account: { balance: newSenderBalance } }),
    ]);
  }
});

export const Transaction = mongoose.model('transaction', transactionSchema);
