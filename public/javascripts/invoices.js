// append to invoice list
socket.on('appendInvoice', function(data) {
  $('#invoicesList > tbody').append(data.body);
  $('#invoicesModal').modal('hide');
});

socket.on('updateInvoicePrice', function(data) {
  $('#invoiceEditModal #invoiceTotal').text(data.total);
  $('#invoiceEditModal #invoiceSubTotal').text(data.subTotal);
})

// add a new invoice to the project (modal save button)
$('#addNewInvoice').live('click', function() {
  var item = $('#invoicesModal > .modal-body > #itemsTbl > tbody > tr');
  var items = [];

  $(item).each(function(key, val) {
    var itemId        = $(val).find('#itemId').val();
    var itemDesc      = $(val).find('#itemDesc').val();
    var itemUnit      = $(val).find('#itemUnit').val();
    var itemUnitCost  = $(val).find('#itemUnitCost').val();
    var itemQty       = $(val).find('#itemQty').val();
    var itemTax       = $(val).find('#itemTax').val();
    var itemTotal     = $(val).find('#itemTotal').val();
    var itemSubTotal  = $(val).find('#itemSubTotal').val();

    var mongoItem = {
      name: itemDesc,
      unit: itemUnit,
      unitCost: itemUnitCost,
      qty: itemQty,
      tax: itemTax,
      total: itemTotal,
      subTotal: itemSubTotal
    };

    if (itemDesc != '' && itemUnitCost != '' && itemQty != '' && itemSubTotal != '' && itemId == '')
      items.push(mongoItem);
  });

  socket.emit('addInvoice', { 
    id:         $('#projectId').val(), 
    invoiceNo:  $('#invoiceNo').val(),
    sinceDate:  $('#timeSince').val(),
    client:     $('#clientName').val(),
    address:    $('#clientAddress').val(),
    dueDate:    $('#timeUntill').val(),
    comment:    $('#comment').val(),
    payed:      $('#payed').val(),
    items:      items,
    totalValue: parseFloat($('#invoiceTotal').text()),
    subTotalValue: parseFloat($('#invoiceSubTotal').text())
  });

  $('#invoicesModal').modal('hide');
});

// send the data.id to the modal form
// needed in order to add invoices for the selected project
$('.addNewInvoice').live('click', function() {
  var projectId = $(this).attr('data-id');
  $('#projectId').val(projectId);
});

// delete invoice from mongo
$('.deleteInvoice').live('click', function() {
  socket.emit('deleteInvoice', { id: $(this).attr('data-id'), invoiceId: $(this).attr('data-invoice') });
});

// return the data so we have the updated invoices list
socket.on('reloadInvoices', function(data) {
  // populate the invoices table body
  $('#invoicesList > tbody').html(data.body);
});

// send data to edit product modal
$('.editInvoice').live('click', function() {
  var projectId = $(this).attr('data-id');
  var invoiceId = $(this).attr('data-invoice');

  socket.emit('showInvoiceData', { id: projectId, invoiceId: invoiceId });
  socket.on('loadInvoiceData', function(data) {
    $('#editInvoiceNo').val(data.body.invoiceNo);
    $('#editTimeSince').val(data.body.sinceDate);
    $('#editClientName').val(data.body.client);
    $('#editClientAddress').val(data.body.address);
    $('#editTimeUntill').val(data.body.dueDate);
    $('#editComment').val(data.body.comment);
    $('#editPayed').val(data.body.payed);
    $('#invoiceEditModal #invoiceTotal').text(data.body.totalValue);
    $('#invoiceEditModal #invoiceSubTotal').text(data.body.subTotalValue);

    $('#invoiceEditModal > .modal-body > #itemsTbl > tbody').html(data.item);
  });

  $('#editProjectId').val(projectId);
  $('#editInvoiceId').val(invoiceId);
});

// update invoice
$('#updateInvoice').live('click', function() {
  socket.emit('updateInvoice', { 
    id:         $('#editProjectId').val(), 
    invoiceId:  $('#editInvoiceId').val(),
    invoiceNo:  $('#editInvoiceNo').val(),
    sinceDate:  $('#editTimeSince').val(),
    client:     $('#editClientName').val(),
    address:    $('#editClientAddress').val(),
    dueDate:    $('#editTimeUntill').val(),
    comment:    $('#editComment').val(),
    payed:      $('#editPayed').val(),
    totalValue: parseFloat($('#invoiceEditModal #invoiceTotal').text()),
    subTotalValue: parseFloat($('#invoiceEditModal #invoiceSubTotal').text())
  });

  var item = $('#invoiceEditModal > .modal-body > #itemsTbl > tbody > tr');

  $(item).each(function(key, val) {
    var itemId        = $(val).find('#itemId').val();
    var itemDesc      = $(val).find('#itemDesc').val();
    var itemUnit      = $(val).find('#itemUnit').val();
    var itemUnitCost  = $(val).find('#itemUnitCost').val();
    var itemQty       = $(val).find('#itemQty').val();
    var itemTax       = $(val).find('#itemTax').val();
    var itemTotal     = $(val).find('#itemTotal').val();
    var itemSubTotal  = $(val).find('#itemSubTotal').val();

    var mongoItem = {
      name: itemDesc,
      unit: itemUnit,
      unitCost: itemUnitCost,
      qty: itemQty,
      tax: itemTax,
      total: itemTotal,
      subTotal: itemSubTotal
    };

    if (itemDesc != '' && itemUnitCost != '' && itemQty != '' && itemSubTotal != '' && itemId == '') {
      socket.emit('addInvoiceItem', { body: mongoItem, projectId: $('#editProjectId').val(), invoiceId: $('#editInvoiceId').val() });
    }
  });

  $('#invoiceEditModal #invoiceTotal').trigger('change');
  $('#invoiceEditModal').modal('hide');
});