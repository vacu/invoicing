var Schema = mongoose.Schema;

Invoices = new Schema({
  invoiceNo: Number,
  sinceDate: String,
  client: String,
  dueDate: String,
  comment: String,
  address: String,
  payed: Number,
  items: [Item],
  totalValue: Number,
  subTotalValue: Number
});

module.exports = db.model('Invoices', Invoices);