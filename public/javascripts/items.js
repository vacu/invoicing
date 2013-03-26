socket.on('reloadInvoiceItems', function(data) {
  $('#invoiceEditModal > .modal-body > #itemsTbl > tbody').html(data.item);
  // $('#invoiceEditModal #invoiceTotal').text(data.totalValue);
  // $('#invoiceEditModal #invoiceSubTotal').text(data.subTotalValue);
});

/* Invoice modal item add action */
$('#addItem').live('click', function() {
  var rowsNo = $('#invoicesModal #itemsTbl > tbody > tr').length + 1;
  $('#invoicesModal #itemsTbl > tbody').append(itemHtml(rowsNo));
});

// calculate total invoice price for new invoice modal
$('#invoicesModal .addItem').live('change', function() {
  // get the current row
  var thisRow = $(this).parent().parent();
  // get the tax 
  var tax = $(thisRow).find('#itemTax').val();
  // calculate the total price of the item
  var calculatedTotal = $(thisRow).find('#itemUnitCost').val() * $(thisRow).find('#itemQty').val();
  var calculatedSubTotal = $(thisRow).find('#itemUnitCost').val() * $(thisRow).find('#itemQty').val();
  if (tax == 1)
    calculatedTotal += calculatedTotal * (19 / 100);
  else if (tax == 2)
    calculatedTotal += calculatedTotal * (7 / 100);

  // get the table rows
  var item = $('#invoicesModal > .modal-body > #itemsTbl > tbody > tr');
  // set the totalPrice to 0
  var totalPrice = 0;
  var subTotalPrice = 0;

  // change the total price for the item
  $(thisRow).find('#itemTotal').val(calculatedTotal);
  $(thisRow).find('#itemSubTotal').val(calculatedSubTotal);
  // loop through the items
  $(item).each(function(key, val) {
    // set the total price of the invoice
    totalPrice = parseFloat(totalPrice) + parseFloat($(val).find('#itemTotal').val());
    subTotalPrice = parseFloat(subTotalPrice) + parseFloat($(val).find('#itemSubTotal').val());
  });

  // send the totalPrice to the invoice modal
  $('#invoicesModal #invoiceTotal').text(totalPrice);
  $('#invoicesModal #invoiceSubTotal').text(subTotalPrice);
});

// calculate total invoice price for new invoice modal
$('#invoiceEditModal .addItem').live('change', function() {
  // get the current row
  var thisRow = $(this).parent().parent();
  //get the tax
  var tax = $(thisRow).find('#itemTax').val();
  // calculate the total price of the item
  var calculatedTotal = $(thisRow).find('#itemUnitCost').val() * $(thisRow).find('#itemQty').val();
  var calculatedSubTotal = $(thisRow).find('#itemUnitCost').val() * $(thisRow).find('#itemQty').val();

  if (tax == 1)
    calculatedTotal += calculatedTotal * (19 / 100);
  else if (tax == 2)
    calculatedTotal += calculatedTotal * (7 / 100);

  // get the table rows
  var item = $('#invoiceEditModal > .modal-body > #itemsTbl > tbody > tr');
  // set the totalPrice to 0
  var totalPrice = 0;
  var subTotalPrice = 0;

  // change the total price for the item
  $(thisRow).find('#itemSubTotal').val(calculatedSubTotal);
  $(thisRow).find('#itemTotal').val(calculatedTotal);
  // loop through the items
  $(item).each(function(key, val) {
    // set the total price of the invoice
    totalPrice = parseFloat(totalPrice) + parseFloat($(val).find('#itemTotal').val());
    subTotalPrice = parseFloat(subTotalPrice) + parseFloat($(val).find('#itemSubTotal').val());
  });

  // send the totalPrice to the invoice modal
  $('#invoiceEditModal #invoiceTotal').text(totalPrice);
  $('#invoiceEditModal #invoiceSubTotal').text(subTotalPrice);
});

/* Invoice edit modal items actions */
$('#addItemEdit').live('click', function() {
  var rowsNo = $('#invoiceEditModal #itemsTbl > tbody > tr').length + 1;
  $('#invoiceEditModal #itemsTbl > tbody').append(itemHtml(rowsNo));
});

// delete the invoice item
$('#invoicesModal .deleteItem').live('click', function() {
  var itemId = $(this).parent().parent().find('#itemId').val();
  var itemTotal = $(this).parent().parent().find('#itemTotal').val();
  var itemSubTotal = $(this).parent().parent().find('#itemSubTotal').val();

  if (itemId != '') {
    socket.emit('deleteInvoiceItem', { body: itemId, id: $('#editProjectId').val(), invoiceId: $('#editInvoiceId').val() });
  } else {
    $(this).parent().parent().remove();
  }

  var currentTotal = parseFloat($('#invoicesModal #invoiceTotal').text());
  var currentSubTotal = parseFloat($('#invoicesModal #invoiceSubTotal').text());

  $('#invoicesModal #invoiceSubTotal').text(currentSubTotal - parseFloat(itemSubTotal));
  $('#invoicesModal #invoiceTotal').text(currentTotal - parseFloat(itemTotal));
});

// delete the invoice item (edit invoice modal)
$('#invoiceEditModal .deleteItem').live('click', function() {
  var itemId = $(this).parent().parent().find('#itemId').val();
  var itemTotal = $(this).parent().parent().find('#itemTotal').val();
  var itemSubTotal = $(this).parent().parent().find('#itemSubTotal').val();

  if (itemId != '') {
    socket.emit('deleteInvoiceItem', { body: itemId, id: $('#editProjectId').val(), invoiceId: $('#editInvoiceId').val() });
  } else {
    $(this).parent().parent().remove();
  }

  var currentTotal = parseFloat($('#invoiceEditModal #invoiceTotal').text());
  var currentSubTotal = parseFloat($('#invoiceEditModal #invoiceSubTotal').text());

  $('#invoiceEditModal #invoiceTotal').text(currentTotal - parseFloat(itemTotal));
  $('#invoiceEditModal #invoiceSubTotal').text(currentSubTotal - parseFloat(itemSubTotal));

  // $('#invoiceEditModal #invoiceTotal').trigger('change');
  $('#invoiceEditModal #invoiceSubTotal').trigger('change');
});

// update total and subtotal price
$('#invoiceEditModal #invoiceSubTotal').live('change', function() {
  var invoiceTotal = parseFloat($('#invoiceEditModal #invoiceTotal').text());
  var invoiceSubTotal = parseFloat($('#invoiceEditModal #invoiceSubTotal').text());

  socket.emit('updateTotalPrice', { total: invoiceTotal, subTotal: invoiceSubTotal, id: $('#editProjectId').val(), invoiceId: $('#editInvoiceId').val() });
})

// if the item changes then emit and save the changes
// only on the edit modal
$('.editItem').live('change', function() {
  var projectId = $('#editProjectId').val();
  var invoiceId = $('#editInvoiceId').val();
  var itemId    = $(this).parent().parent().find('.itemNo').find('#itemId').val();

  var thisRow = $(this).parent().parent();

  // set the total value of the invoice
  var tax = $(thisRow).find('#itemTax').val();
  var calculatedTotal = $(thisRow).find('#itemUnitCost').val() * $(thisRow).find('#itemQty').val();
  var calculatedSubTotal = $(thisRow).find('#itemUnitCost').val() * $(thisRow).find('#itemQty').val();
  
  if (tax == 1)
    calculatedTotal += calculatedTotal * (19 / 100);
  else if (tax == 2)
    calculatedTotal += calculatedTotal * (7 / 100);

  $(thisRow).find('#itemTotal').val(calculatedTotal);
  $(thisRow).find('#itemSubTotal').val(calculatedSubTotal);

  console.log(calculatedSubTotal);
  console.log(calculatedTotal);

  var data = {
    name:     $(thisRow).find('#itemDesc').val(),
    unit:     $(thisRow).find('#itemUnit').val(),
    unitCost: $(thisRow).find('#itemUnitCost').val(),
    qty:      $(thisRow).find('#itemQty').val(),
    tax:      $(thisRow).find('#itemTax').val(),
    total:    $(thisRow).find('#itemTotal').val(),
    subTotal: $(thisRow).find('#itemSubTotal').val()
  }

  // if we don't have an item id then do nothing
  if (itemId != '')
    socket.emit('updateItem', { id: itemId, projectId: projectId, invoiceId: invoiceId, body: data });
});