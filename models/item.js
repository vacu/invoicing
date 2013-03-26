var Schema = mongoose.Schema;

Item = new Schema({
  name: String,
  unit: String,
  unitCost: Number,
  qty: Number,
  tax: String,
  total: Number,
  subTotal: Number
});

module.exports = db.model('Item', Item);