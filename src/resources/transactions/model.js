import mongoose from 'mongoose';
import crypto from 'crypto';

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    transferType: {
      type: String,
      enum: ['bank', 'money'],
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, reference: 1 });

transactionSchema.pre('save', function(next) {
  const generateId = type => {
    const getPrefix = {
      deposit: 'DEP',
      withdrawal: 'WID',
      transfer: 'TRF',
    };

    let result = `${type}`;
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 8; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }

    /**
     * Gets a prefix based on transaction type
     * @param {String} type transaction type
     *
     * @returns {String} prefix
     */
    const prefix = getPrefix[type];
    const uniqueString = crypto
      .createHash('sha256')
      .update(result, 'utf8')
      .digest('hex');

    return `${prefix}${uniqueString.toUpperCase()}`;
  };

  this.reference = generateId(this.type);
  next();
});

export const Transaction = mongoose.model('transaction', transactionSchema);
