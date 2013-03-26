var Projects = require('../models/project')
  , Invoices = require('../models/invoice')
  , Item     = require('../models/item');

module.exports = {
  saveItem: function(socket) {
    // add new item to invoice
    socket.on('addInvoiceItem', function(data) {
      Projects.findById(data.projectId, function(err, doc) {
        var invoice = doc.invoices.id(data.invoiceId);
        var item = new Item();

        // get the data from the view
        item.name     = data.body.name;
        item.unit     = data.body.unit;
        item.unitCost = data.body.unitCost;
        item.qty      = data.body.qty;
        item.tax      = data.body.tax;
        item.total    = data.body.total;
        item.subTotal = data.body.subTotal;

        // save item to db
        invoice.items.push(item);
        doc.save(function(err, doc) {
          // getting all the items for the current invoice
          var invoice = doc.invoices.id(data.invoiceId);
          var html = '';

          // looping through the invoice items and rendering the partial
          (invoice.items).forEach(function(val, key) {
            html += render('_item', { item: val })
          });

          // if other users are trying to edit the same invoice then we should emit to them
          io.sockets.emit('reloadInvoiceItems', { item: html });
        });
      });
    });
  },

  delItem: function(socket) {
    // delete the item from the invoice
    socket.on('deleteInvoiceItem', function(data) {
      Projects.findById(data.id, function(err, doc) {
        var invoice = doc.invoices.id(data.invoiceId);
        invoice.items.id(data.body).remove();

        doc.save(function(err, doc) {
          var invoice = doc.invoices.id(data.invoiceId);
          var html = '';

          (invoice.items).forEach(function(val, key) {
            html += render('_item', { item: val })
          });

          io.sockets.emit('reloadInvoiceItems', { item: html });
        });
      });
    });
  },

  updItem: function(socket) {
    // update the invoice item
    // called on change
    socket.on('updateItem', function(data) {
      Projects.findById(data.projectId, function(err, doc) {
        var invoice = doc.invoices.id(data.invoiceId);
        var item = invoice.items.id(data.id);

        item.name     = data.body.name;
        item.unit     = data.body.unit;
        item.unitCost = data.body.unitCost;
        item.qty      = data.body.qty;
        item.tax      = data.body.tax;
        item.total    = data.body.total;
        item.subTotal = data.body.subTotal;

        doc.save(function(err, doc) {
          var invoice = doc.invoices.id(data.invoiceId);
          var html = '';

          (invoice.items).forEach(function(val, key) {
            html += render('_item', { item: val })
          });

          io.sockets.emit('reloadInvoiceItems', { item: html });
        });
      });
    });
  },

  updTotalPrice: function(socket) {
    socket.on('updateTotalPrice', function(data) {
      Projects.findById(data.id, function(err, doc) {
        var invoice = doc.invoices.id(data.invoiceId);
        invoice.totalValue = data.total;
        invoice.subTotalValue = data.subTotal;
        doc.save(function(err, doc) {
          io.sockets.emit('updateInvoicePrice', { total: data.total, subTotal: data.subTotal });
        });
      });
    });
  }
}
