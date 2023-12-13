$(document).ready(function () {



    var dataTable = $("#dataTable").DataTable({
        lengthMenu: [10, 25, 50, 100],
        ajax: {
            url: "php/admin.php",
            type: "GET",
            dataType: "json",
            dataSrc: "",
        },
        columns: [
            { data: "id" },
            { data: "name" },
            { data: "type" },
            { data: "linkshared" },
            { data: "queue" },
            { data: "total" },
            {
                data: null,
                render: function (data, type, row) {

                    if (row.status == 1) {

                        return (
                            '<div class="d-flex"><button class="btn btn-primary btn-sm  text-light editBtn mx-1" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Edit waitlist" data-id="' +
                            row.id +
                            '"><i class="fa-solid fa-file-pen"></i></button> <button class="btn btn-success btn-sm switchBtn mx-1" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Change visibility" data-id="' +
                            row.id +
                            '"> <i class="fas fa-eye"></i></button> <button class="btn btn-dark btn-sm mailBtn mx-1" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Ship products" data-id="' +
                            row.id +
                            '"> <i class="fa-solid fa-envelope-circle-check"></i></i></button><button id="view" class="btn btn-primary" data-id="' +
                            row.id +
                            '"><i class="fa-solid fa-clipboard-list"></i></button></div>'

                        );
                    } else {
                        return (
                            '<div class="d-flex"><button class="btn btn-primary btn-sm  text-light editBtn mx-1" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Edit waitlist" data-id="' +
                            row.id +
                            '"><i class="fa-solid fa-file-pen"></i></button> <button class="btn btn-danger btn-sm switchBtn mx-1" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Change visibility" data-id="' +
                            row.id +
                            '"> <i class="fas fa-eye-slash"></i></button> <button class="btn btn-dark btn-sm mailBtn mx-1" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Ship products" data-id="' +
                            row.id +
                            '"> <i class="fa-solid fa-envelope-circle-check"></i></i></button><button id="view" class="btn btn-primary" data-id="' +
                            row.id +
                            '"><i class="fa-solid fa-clipboard-list"></i></button></div>'

                        );
                    }
                },
            },
        ],
    });


    var dataTable2 = $("#dataTable2").DataTable();



    // Manually trigger the AJAX call to populate the table
    $("#refreshButton").on("click", function () {
        dataTable.ajax.reload();
    });

    $("#dataTable").on("click", ".editBtn", function (event) {
        var data = $(this).data('id');
        console.log("edit", data);

        $.ajax({
            type: "GET",
            url: "php/admin.php",
            data: { tableid: data },
            dataType: "json",
            success: function (res) {
                console.log("res", res);
                if (res.status == 200) {


                    // console.log("res", res.status);
                    // console.log(12345);

                    $('#idx').val(data);
                    $('#editName').val(res.name);
                    $('#editType').val(res.type);
                    $('#editSub').val(res.subhead);
                    $('#editCont').val(res.content);
                    $('#editImg').val(res.img);
                    $('#editWaitModal').modal('show');
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        showCloseButton: true,
                        text: res.message,
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("Error logging out:", error);
            },
        });
    });

    $('#editWait').submit(function (event) {
        event.preventDefault();
        data = $(this).serialize();
        // console.log(data);
        $.ajax({
            type: "POST",
            url: "php/admin.php",
            data: data,
            dataType: "json",
            success: function (res) {
                if (res.status == 200) {
                    $('#dataTable').DataTable().ajax.reload();
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        showCloseButton: true,
                        text: res.message,
                    })
                    $('#editWait')[0].reset();
                    $('#editWaitModal').modal('hide');
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        showCloseButton: true,
                        text: res.message,
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("Error logging out:", error);
            },
        });

    });

    $("#dataTable").on("click", ".switchBtn", function (event) {
        var data = $(this).data('id');
        console.log("switch", data);
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to change the visibility of this waitlist?",
            icon: 'question',
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            confirmButtonColor: '#198754',
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: "php/admin.php",
                    data: { switchid: data },
                    dataType: "json",
                    success: function (res) {
                        console.log("res", res);
                        if (res.status == 200) {
                            $('#dataTable').DataTable().ajax.reload();
                            Swal.fire({
                                icon: "success",
                                title: "Success",
                                showCloseButton: true,
                                text: res.message,
                            })
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                showCloseButton: true,
                                text: res.message,
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error("Error logging out:", error);
                    },
                });
            }
        })

    });

    $("#dataTable").on("click", ".mailBtn", function (event) {
        var productId = $(this).data('id');

        Swal.fire({
            title: 'How many products ready to ship?',
            input: 'number',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            confirmButtonColor: '#198754',
            confirmButtonText: 'Ship it!'
        }).then((result) => {
            if (result.value <= 0) {
                console.log("0");
                Swal.fire({
                    icon: "info",
                    title: "Oops...",
                    showCloseButton: true,
                    text: "You can't ship 0 products!",
                });
                return;
            }

            if (result.isConfirmed) {
                Swal.fire({
                    imageUrl: "https://cdn.dribbble.com/users/1914549/screenshots/5361637/day22.gif",
                    imageHeight: 200,
                    imageAlt: "A tall image",
                    color: "#716add",
                    title: 'Sending mails...one by one',
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    showConfirmButton: false, // Remove the OK button
                    didOpen: () => {
                        Swal.showLoading();

                        // Make your AJAX request here
                        $.ajax({
                            type: "POST",
                            url: "php/ship.php",
                            data: {
                                id: productId,
                                count: result.value
                            },
                            success: function (res) {
                                console.log(res);

                                // Close the Swal when the AJAX request is complete
                                Swal.close();
                                $('#dataTable').DataTable().ajax.reload();
                                Swal.fire({
                                    icon: "success",
                                    title: "Success",
                                    showCloseButton: true,
                                    text: 'Mails are sending...',
                                });
                            },
                            error: function (xhr, status, error) {
                                console.error("Error during AJAX request:", error);
                                $('#dataTable').DataTable().ajax.reload();

                                // Close the Swal when the AJAX request encounters an error
                                Swal.close();

                                Swal.fire({
                                    icon: "error",
                                    title: "Error",
                                    showCloseButton: true,
                                    text: 'Mails are not sent completely',
                                });
                            },
                        });
                    },
                });

            }
        });
    });

    $("#dataTable").on("click", "#view", function (event) {
        
        var id = $(this).data('id');

        // Get the data from the server
        $.ajax({
            url: "php/down.php",
            type: "GET",
            data: { id: id },
            dataType: "json",
            success: function (data) {
                // Clear the existing data from the table
                dataTable2.clear();

                // Loop through the array and add the data to the table
                for (var i = 0; i < data.length; i++) {
                    dataTable2.row.add([
                        i+1,
                        data[i].name,
                        data[i].referal,
                        data[i].status,
                    ]);
                }

                // Redraw the table
                dataTable2.draw();
            },error: function (xhr, status, error) {
                console.error("Error during AJAX request:", error);
            },

        });

        $("#dataModal").modal("show");

    });

});



$(document).ready(function () {

    function loggedIn(callback) {
        $.ajax({
            type: "GET",
            url: "php/session.php",
            dataType: "json",
            success: function (res) {
                if (res.status === 200) {
                    callback(true);
                } else {
                    callback(false);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error checking login:", error);
                callback(false);
            },
        });
    }
    loggedIn(function (result) {
        // console.log(result);
        if (result == false) {
            Swal.fire({
                timer: 1000,
                icon: "error",
                title: "Oops...",
                showConfirmButton: false,
                text: "You are not logged in!",
                backdrop: `rgba(0,0,0,1)`
            }).then(function () {
                window.location.href = "index.html";
            });
        }
    });

    // ------------------------- other functions -------------------------

    loggedIn(function (isLoggedIn) {
    });

    // -------------------------------------------------------------------


    $('#logoutBtn').click(function (event) {
        event.preventDefault();

        $.ajax({
            type: "GET",
            url: "php/logout.php",
            dataType: "json",
            success: function (res) {
                if (res.status === 200) {
                    localStorage.removeItem("email");

                    // loggedIn(function (isLoggedIn) {
                    // });
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        showCloseButton: true,
                        text: res.message,
                    }).then(function () {
                        window.location.href = "index.html";
                    });

                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        showCloseButton: true,
                        text: res.message,
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("Error logging out:", error);
            },
        });
    });

    $('#newWait').submit(function (event) {
        event.preventDefault();

        if ($('#waitSub').val().length > 250) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                showCloseButton: true,
                text: "Subhead is too long!",
            });
            return;
        }

        //if waitDesc contains any single quotes or double show warning


        data = $(this).serialize();
        // console.log(data);
        $.ajax({
            type: "POST",
            url: "php/admin.php",
            data: data,
            dataType: "json",
            success: function (res) {
                if (res.status == 200) {
                    $('#dataTable').DataTable().ajax.reload();
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        showCloseButton: true,
                        text: res.message,
                    })
                    $('#newWait')[0].reset();
                    $('#newWaitModal').modal('hide');
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        showCloseButton: true,
                        text: res.message,
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("Error logging out:", error);
            },
        });
    });



});




