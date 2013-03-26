// sending project data to be saved
// appending the newly created project to the list
socket.on('sendme', function(data) {
  $('#projectsList').append(data.body);
  $('#projectsModal').modal('hide');
});

// re-rendering the projects list
socket.on('newProjectList', function(data) {
  $('#projectsList').html(data.body);
});

// add a new project (modal save button)
$('#addNewProj').live('click', function() {
  if ($('#projectsModal #projectName').val().length < 1) {
    Alerts.error('Your project name is empty.');
  } else {
    $('.alert-error').hide();
    Alerts.success('Your project has been added');
    socket.emit('clicked', { name : $('#projectName').val() });
  }
});

$('#closeProjectModal').live('click', function() {
  $('.alert-error').hide();
});

// send data to the modal
$('.editProject').live('click', function() {
  var projectId = $(this).attr('data-id');
  socket.emit('showProjectName', { id: projectId });
  // getting the project name and the id
  socket.on('loadProjectName', function(data) {
    $('#editProjectName').val(data.body);
    $('#editProjectId').val(data.id);
  });
});

// sending the data to backend to edit the project
$('#updateProject').live('click', function() {
  socket.emit('updateProject', { id: $('#editProjectId').val(), name: $('#editProjectName').val() });
  $('#projectEditModal').modal('hide');
});

// select invoices for the clicked project
$('.projectId').live('click', function() {
  // send data to backend to retrieve the invoices for the project
  socket.emit('showInvoices', { id: $(this).attr('data-id') });

  // return data from backend for the selected project
  socket.on('returnInvoices', function(data) {
    $('#invoicesList > tbody').html(data.body);
  });
});

// delete project
$('.deleteProject').live('click', function() {
  // remove the project from mongo
  socket.emit('deleteProject', { id: $(this).attr('data-id') });
});

socket.on('reloadProjects', function(data) {
   $('#projectsList').html(data.body);
});