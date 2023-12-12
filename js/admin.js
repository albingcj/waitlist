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
            { data: "queue" },
            { data: "linkshared" },
            { data: "total" },
            {
                data: null,
                render: function (data, type, row) {
                    return (
                        '<button class="btn btn-info btn-sm editBtn" data-id="' +
                        row.id +
                        '">Edit <i class="fa fa-pencil"></i></button>'
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
            data: {tableid: data},
            dataType: "json",
            success: function (res) {
                if (res.status == 200) {
                    $('#idx').val(data);
                    $('#editName').val(res.name);
                    $('#editType').val(res.type);
                    $('#editSub').val(res.subhead);
                    $('#editCont').val(res.content);
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
});



$(document).ready(function () {

    // function createTable(data) {
    //     var table = document.getElementById("adminTable");
    //     //clear the table
    //     table.innerHTML = "";

    //     data.forEach(function (user) {
    //         // console.log(user);
    //         var row = `
    //             <tr class="text-center">
    //                 <td>${user.id}</td>
    //                 <td>${user.name}</td>
    //                 <td>${user.type}</td>
    //                 <td>${parseInt(user.total)-parseInt(user.queue)}</td>
    //                 <td>${user.queue}</td>
    //                 <td>${user.total}</td>
    //                 <td></td>
    //             </tr>
    //         `;
    //         // Append the row to the table
    //         table.innerHTML += row;
    //     });
    // }

    // function fetch() {
    //     $.ajax({
    //         type: "GET",
    //         url: "php/admin.php",
    //         dataType: "json",
    //         success: function (res) {
    //             createTable(res);
    //         },
    //         error: function (xhr, status, error) {
    //             console.error("Error fetching data:", error);
    //         },
    //     });
    // }


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
    // fetch();

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


