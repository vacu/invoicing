var socket = io.connect();

$(document).ready(function() {
  $('.alert').hide();

  $('#timeSince').datepicker();
  $('#timeUntill').datepicker();
  $('#editTimeSince').datepicker();
  $('#editTimeUntill').datepicker();
});

function itemHtml(rowsNo) {
  var html = '<tr><td>#' + (rowsNo) + '<input type="hidden" id="itemId" /></td>\n\
      <td><input type="text" id="itemDesc" /></td>\n\
      <td><select id="itemUnit">\n\
      <option value="0">No unit</option>\n\
      <option value="1">Pieces</option>\n\
      <option value="2">Boxes</option>\n\
      <option value="3">Kg</option>\n\
      </select></td>\n\
      <td><input class="addItem" type="text" id="itemUnitCost" /></td>\n\
      <td><input class="addItem" type="text" id="itemQty" /></td>\n\
      <td><select id="itemTax" class="addItem">\n\
      <option value="0">No tax</option>\n\
      <option value="1">19%</option>\n\
      <option value="2">7%</option>\n\
      </select></td>\n\
      <td class="itemTotal"><input type="hidden" id="itemTotal" value="0" /><input type="text" id="itemSubTotal" value="0" /></td>\n\
      <td><button class="deleteItem close">&times;</button></td>\n\
      </tr>';
  return html;
}

Alerts = {
  error: function(msg) {
    $('.alert-error').html(msg);
    $('.alert-error').show();
  },
  success: function(msg) {
    $('.alert-success').html(msg);
    $('.alert-success').show();

    setTimeout(function() {
      $('.alert-success').hide();
    }, 3000);
  }
}