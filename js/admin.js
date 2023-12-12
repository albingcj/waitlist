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
                    return (
                        '<button class="btn btn-primary btn-sm  text-light editBtn" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Edit waitlist" data-id="' +
                        row.id +
                        '"><i class="fa-solid fa-file-pen"></i></button> <button class="btn btn-danger btn-sm switchBtn" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Change visibility" data-id="' +
                        row.id +
                        '"> <i class="fas fa-eye"></i></button>'
                    );
                },
            },
        ],
    });

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
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            confirmButtonColor: '#d33',
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
                icon: "error",
                title: "Oops...",
                showCloseButton: true,
                text: "You are not logged in!",
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


