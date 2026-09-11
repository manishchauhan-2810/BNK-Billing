const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequenceValue: { type: Number, default: 0 }
});

counterSchema.statics.getNextSequence = async function(counterName) {
  const counter = await this.findOneAndUpdate(
    { _id: counterName },
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true }
  );
  return counter.sequenceValue;
};

module.exports = mongoose.model('Counter', counterSchema);
