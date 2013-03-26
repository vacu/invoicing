var Projects = require('../models/project')
  , Invoices = require('../models/invoice');

module.exports = {
  invShow: function(socket) {
    // show invoices when the project is selected
    // private emit socket
    socket.on('showInvoices', function(data) {
      Projects.findById(data.id, function(err, doc) {
        var data = '';
        (doc.invoices).forEach(function(val, key) {
          data += render('_invoiceItem', { dataId: doc.id, data: val, invoiceId: val.id })
        });
        socket.emit('returnInvoices', { body: data });
      });
    });
  },

  invShowData: function(socket) {
    // show single invoice
    // private emit socket
    socket.on('showInvoiceData', function(data) {
      Projects.findById(data.id, function(err, doc) {
        var invoice = doc.invoices.id(data.invoiceId);
        var html = '';

        // looping through the invoice items and rendering the partial
        (invoice.items).forEach(function(val, key) {
          html += render('_item', { item: val })
        });

        socket.emit('loadInvoiceData', { body: invoice, item: html });
      });
    });
  },

  invAdd: function(socket) {
    // add new invoice
    socket.on('addInvoice', function(data) {
      Projects.findById(data.id, function(err, doc) {
        var invoice           = new Invoices();
        invoice.invoiceNo     = data.invoiceNo;
        invoice.sinceDate     = data.sinceDate;
        invoice.client        = data.client;
        invoice.address       = data.address;
        invoice.dueDate       = data.dueDate;
        invoice.comment       = data.comment;
        invoice.payed         = data.payed;
        invoice.items         = data.items;
        invoice.totalValue    = data.totalValue;
        invoice.subTotalValue = data.subTotalValue;

        // since we don't have the invoice id yet we cannot get the info from mongo
        var invoiceData = {
          invoiceNo:      data.invoiceNo,
          sinceDate:      data.sinceDate,
          client:         data.client,
          address:        data.address,
          dueDate:        data.dueDate,
          comment:        data.comment,
          payed:          data.payed,
          totalValue:     data.totalValue,
          subTotalValue:  data.subTotalValue
        }

        doc.invoices.push(invoice);
        doc.save(function(err, doc) {
          io.sockets.emit('appendInvoice', { body: render('_invoiceItem', { dataId: doc.id, data: invoiceData, invoiceId: invoice.id })});
        });
      });
    });
  },

  invDel: function(socket) {
    // delete invoice
    socket.on('deleteInvoice', function(data) {
      Projects.findById(data.id, function(err, doc) {
        doc.invoices.id(data.invoiceId).remove();

        doc.save(function(err, doc) {
          var invData = '';
          (doc.invoices).forEach(function(val, key) {
            invData += render('_invoiceItem', { dataId: doc.id, data: val, invoiceId: val.id })
          });
          io.sockets.emit('reloadInvoices', { body: invData });
        });
      });
    });
  },

  invUpd: function(socket) {
    //update invoice
    socket.on('updateInvoice', function(data) {
      Projects.findById(data.id, function(err, doc) {
        var invoice             = doc.invoices.id(data.invoiceId);
        invoice.invoiceNo       = data.invoiceNo;
        invoice.sinceDate       = data.sinceDate;
        invoice.client          = data.client;
        invoice.address         = data.address;
        invoice.dueDate         = data.dueDate;
        invoice.comment         = data.comment;
        invoice.payed           = data.payed;
        invoice.totalValue      = data.totalValue;
        invoice.subTotalValue   = data.subTotalValue;

        doc.save(function(err, doc) {
          var data = '';
          (doc.invoices).forEach(function(val, key) {
            data += render('_invoiceItem', { dataId: doc.id, data: val, invoiceId: val.id })
          });
          io.sockets.emit('reloadInvoices', { body: data });
        });
      });
    });
  }
}
