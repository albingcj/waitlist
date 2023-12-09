$(document).ready(function() {
    $('.registerBtn').click(function() {
        var waitType = $(this).data('waitType');

        // Set the value of the modal input field
        $('#waitType').val(waitType);

        // Open the modal if it's not open already
        $('#regModal').modal('show');
    });
});
