$(document).ready(function () {
    // Function to create content for the accordion button
    function createAccordionButtonContent(item) {
        var buttonContent = $(
            '<div class="d-flex align-items-center">' +
            '<div class="col d-flex align-items-center">' +
            '<img src="' +
            item.image +
            '" alt="' +
            item.name +
            '" class="me-2 img-fluid" height="100" width="100" />' +
            "<div>" +
            '<h5 class="mb-0">' +
            item.name +
            "</h5>" +
            '<p class="mb-0">' +
            item.subhead +
            "</p>" +
            '<div type="button" class="btn btn-primary mt-3 rounded-0 regBtn" data-bs-toggle="modal" data-bs-target="#waitRegModal" data-type="' +
            item.type +
            '">Register</div>' +
            "</div>" +
            "</div>" +
            "</div>"
        );

        return buttonContent;
    }
    // function to get contents of table body
    function addTable(id) {
        $.ajax({
            type: "GET",
            url: "php/table.php",
            dataType: "json",
            data: { id: id },
            success: function (data) {
                console.log("Data fetched successfully");
                createTable(data, id);
            },
            error: function (xhr, status, error) {
                console.error("Error fetching accordion data:", error);
            },
        });
    }

    // Function to create table body
    function createTable(data, id) {
        var tableBody = $("#tableBody" + id);
        tableBody.empty();
        if (data.length === 0) {
            // If data is empty, add a row indicating no data
            tableBody.append(
                `<tr>
                <td colspan="3" class="text-center">Be the first one to be registered</td>
            </tr>`
            );
        } else {
            // If data is not empty, create rows as usual
            var rowNum = 1;

            $.each(data, function (index, item) {
                // Use template string to create the table row
                var tableRow = $(
                    `<tr>
                    <td scope="row">${rowNum}</td>
                    <td>${item.name}</td>
                    <td>${item.count}</td>
                </tr>`
                );

                // Increment the row number for the next iteration
                rowNum++;

                tableBody.append(tableRow);
            });
        }
    }

    // Function to create the accordion body
    function createAccordionBody(item) {
        var accordionBody = $(
            '<div id="collapse' +
            item.id +
            '" class="accordion-collapse collapse show" data-bs-parent="#accordionWait">' +
            '<div class="accordion-body">' +
            '<div class="row" id="bodyContent">' +
            item.content +
            "</div>" +
            '<div class="table-responsive">' +
            '<table class="table table-hover table-borderless text-center border">' +
            '<caption class="text-center">' +
            item.last_updated +
            "</caption>" +
            '<thead class="table-dark">' +
            '<tr class="table-danger">' +
            "<th>Rank</th>" +
            "<th>Name</th>" +
            "<th>Points</th>" +
            "</tr>" +
            "</thead>" +
            '<tbody class="table-group-divider" id="tableBody' +
            item.id +
            '">' +
            "</tbody>" +
            "<tfoot>" +
            "</tfoot>" +
            "</table>" +
            "</div>" +
            "</div>" +
            "</div>"
        );
        addTable(item.id);

        return accordionBody;
    }

    // Function to create a single accordion item
    function createAccordionItem(item) {
        var accordionItem = $('<div class="accordion-item "></div>');
        var accordionHeader = $('<h2 class="accordion-header"></h2>');
        var accordionButton = $('<button class="accordion-button shadow-none "></button>');

        // Set attributes for the accordion button
        accordionButton.attr({
            type: "button",
            "data-bs-toggle": "collapse",
            "data-bs-target": "#collapse" + item.id,
            "aria-expanded": "true",
            "aria-controls": "collapse" + item.id,
        });

        // Create the content for the accordion button
        var buttonContent = createAccordionButtonContent(item);
        accordionButton.append(buttonContent);

        // Append the button to the accordion header
        accordionHeader.append(accordionButton);

        // Create the accordion body
        var accordionBody = createAccordionBody(item);

        // Append header and body to the accordion item
        accordionItem.append(accordionHeader, accordionBody);

        return accordionItem;
    }
    // Function to create accordion items dynamically
    function createAccordions(data) {
        var accordionContainer = $("#accordionWait");

        // Clear existing accordion items
        accordionContainer.empty();

        // Iterate through the data and create accordion items
        $.each(data, function (index, item) {
            var accordionItem = createAccordionItem(item);
            accordionContainer.append(accordionItem);
        });

        // Attach click event to dynamically added regBtn

        $(".regBtn").click(function (event) {
            console.log("Register button clicked");

            // Access the clicked button using event.target
            var clickedButton = $(event.target);

            // Retrieve the waitType from the clicked button
            var waitType = clickedButton.data("type");

            console.log("waitType: " + waitType);

            // Set the value of the modal input field
            $("#waitType").val(waitType);

            // Open the modal if it's not open already
            $("#regModal").modal("show");
        });
    }
    // Function to fetch data from PHP script
    function fetchData() {
        $.ajax({
            type: "GET",
            url: "php/fetch.php",
            dataType: "json",
            success: function (data) {
                console.log("Data fetched successfully");
                createAccordions(data);
            },
            error: function (xhr, status, error) {
                console.error("Error fetching accordion data:", error);
            },
        });
    }
    function loggedIn() {
        $.ajax({
            type: "GET",
            url: "php/session.php",
            dataType: "json",
            success: function (res) {
                if (res.status === 200) {
                    console.log("logged in");
                    // $("#lrBtns").hide();
                    // $("#loutBtn").show();
                    // add d-none class to lrbtns div
                    $("#lrBtns").addClass("d-none")
                    $("#loutBtn").removeClass("d-none")

                    $("#perDet").html(
                        `<p class="text-center">Welcome ${res.email}</p>` +
                        `<p class="text-center">${res.name}</p>`
                    )

                } else {
                    console.log("not logged in");
                    $("#loutBtn").addClass("d-none")
                    $("#lrBtns").removeClass("d-none")
                }
            },
            error: function (xhr, status, error) {
                console.error("Error checking login:", error);
            },
        });
    }

    function refreshDivs() {
        $('#headerId').load(window.location.href + ' #headerId');
        $('#mainId').load(window.location.href + ' #mainId');
    
    }

    // Fetch data on document ready
    fetchData();
    loggedIn();
    // already logged in ?



    // login form
    $("#loginForm").submit(function (event) {
        event.preventDefault();

        // Get the form data
        var formData = $(this).serialize();

        // Submit the form using AJAX
        $.ajax({
            type: "POST",
            url: "php/login.php",
            data: formData,
            success: function (res) {
                res = JSON.parse(res);
                if (res.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        showCloseButton: true,
                        text: res.message,
                    });
                    $("#loginModal").modal("hide");
                    fetchData();
                    loggedIn();
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
                console.error("Error logging in:", error);
            },
        });
    });

    //register form
    $("#registerForm").submit(function (event) {
        event.preventDefault();

        var password1 = $("#regPass1").val();
        var password2 = $("#regPass2").val();

        if (password1 !== password2) {
            // Passwords do not match, show an error or take appropriate action
            Swal.fire({
                icon: "error",
                title: "Oops...",
                showCloseButton: true,
                text: "Passwords do not match!",
            });
            return;
        }
        // Get the form data
        var formData = $(this).serialize();

        // Submit the form using AJAX
        $.ajax({
            type: "POST",
            url: "php/register.php",
            data: formData,
            dataType: "json",
            success: function (res) {
                // console.log('Registration successful');
                // res = JSON.parse(res);
                console.log(res);
                console.log(res.message);
                if (res.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        showCloseButton: true,
                        text: res.message,
                    });
                    $("#registerModal").modal("hide");

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
                console.error("Error registering:", error);
            },
        });
    });

    // logout
    $('#logoutBtn').click(function (event) {
        event.preventDefault();

        $.ajax({
            type: "GET",
            url: "php/logout.php",
            dataType: "json",
            success: function (res) {
                if (res.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        showCloseButton: true,
                        text: res.message,
                    });
                    $('#perDet').empty();

                    loggedIn();
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
