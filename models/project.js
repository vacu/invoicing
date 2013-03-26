var Schema = mongoose.Schema;

Projects = new Schema({
  name: String,
  active: Boolean,
  invoices: [Invoices]
});

module.exports = db.model('Projects', Projects);