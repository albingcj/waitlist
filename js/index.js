$(document).ready(function () {
    // Function to create content for the accordion button
    function createAccordionButtonContent(item, flagForButton) {
        var btnx;
        if (item.status == 0) {
            if (flagForButton === 1) {
                btnx = '<div type="button" class="btn btn-success mt-3 rounded-0 shareBtn" data-type="' +
                    item.type +
                    '" data-tableid="' +
                    item.id +
                    '">Share<i class="fas fa-share mx-2"></i></div>';

            } else {
                btnx = '<div type="button" class="btn btn-primary mt-3 rounded-0 regBtn" data-type="' +
                    item.type +
                    '"data-tableid="' +
                    item.id +
                    '">Register <i class="fa-solid fa-ticket mx-1"></i></div>';
            }
        } else {
            btnx = '<div type="button" class="btn btn-secondary mt-3 rounded-0" disabled>Registration Closed<i class="fa-solid fa-lock ms-2"></i></div>';
        }

        var buttonContent = $(
            '<div class="d-flex align-items-center">' +
            '<div class="col d-flex align-items-center">' +
            '<img src="' +
            item.image +
            '" alt="' +
            item.name +
            '" class="me-2 col-auto" style="width:100px;height:100px" />' +
            "<div>" +
            '<h5 class="mb-0">' +
            item.name +
            "</h5>" +
            '<p class="mb-0">' +
            item.subhead +
            "</p>" +
            btnx +
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
            data: {
                id: id
            },
            success: function (data) {
                console.log(data.user);
                createTable(data.topRecords, id);
                createTable2(data.user, id);
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
    function createTable2(data, id) {
        var tableBody = $("#tableBody" + id);
        // tableBody.empty();
        if (data.length === 0) {
            // If data is empty, add a row indicating no data
            tableBody.append(
                `<tr>
                <td colspan="3" class="text-center">Be the first one to be registered</td>
            </tr>`
            );
        } else {

            var tableRow = $(
                `<tr class="table-primary">
                    <td scope="row">${data.position}</td>
                    <td>You</td>
                    <td>${data.count}</td>
                </tr>`
            );


            tableBody.append(tableRow);

        }
    }
    // Function to create the accordion body
    function createAccordionBody(item) {
        var accordionBody = $(
            '<div id="collapse' +
            item.id +
            '" class="accordion-collapse collapse show" data-bs-parent="#joinedAccordionWait">' +
            '<div class="accordion-body">' +
            '<div class="row p-3" id="bodyContent">' +
            item.content +
            "</div>" +
            '<div class="table-responsive">' +
            '<table class="table table-hover table-borderless text-center border">' +
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
    function createAccordionItem(item, flagForButton) {
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
        var buttonContent = createAccordionButtonContent(item, flagForButton);
        accordionButton.append(buttonContent);

        // Append the button to the accordion header
        accordionHeader.append(accordionButton);

        // Create the accordion body
        var accordionBody = createAccordionBody(item);

        accordionItem.append(accordionHeader, accordionBody);

        return accordionItem;
    }
    // Function to create accordion items dynamically
    function createAccordions(data1, container1, data2, container2) {
        // Clear existing accordion items in both containers
        container1.empty();
        container2.empty();


        $.each(data1, function (index, item) {
            var accordionItem = createAccordionItem(item, 1);
            container1.append(accordionItem);
        });

        // Iterate through the data2 and create accordion items for container2
        $.each(data2, function (index, item) {
            var accordionItem = createAccordionItem(item, 2);
            container2.append(accordionItem);
        });

        // Attach click event to dynamically added regBtn

        $(".regBtn").click(function (event) {
            console.log("Register refreshed with id:", $(this).data("tableid"));

            // Access the clicked button using event.target
            var clickedButton = $(event.target);

            // Retrieve the waitType from the clicked button

            var waitType = clickedButton.data("type");
            var tableid = $(this).data("tableid");

            $("#regForm").attr("data-tableid", tableid);

            // Set the value of the modal input field
            $("#waitType").val(waitType);
            // $("#waitname").val(localStorage.getItem("email"));
            loggedIn(function (result) {
                // console.log(result);
                if (result == true) {
                    $("#waitRegModal").modal("show");
                } else {
                    Swal.fire({
                        icon: "info",
                        title: "Oops...",
                        showCloseButton: true,
                        text: "Please login to register!",
                    });
                }
            });
            // Open the modal if it's not open already
            // $("#regModal").modal("show");
        });
    }
    // Function to fetch data from PHP script
    function fetchData() {
        $.ajax({
            type: "GET",
            url: "php/fetch.php",
            dataType: "json",
            success: function (res) {
                if ('data1' in res && 'data2' in res) {
                    // Access the containers for accordion items
                    var joinedAccordionContainer = $("#joinedAccordionWait");
                    var notJoinedAccordionContainer = $("#notJoinedAccordionWait");

                    // Call createAccordions with the retrieved data and containers
                    createAccordions(res.data1, joinedAccordionContainer, res.data2, notJoinedAccordionContainer);
                } else {
                    console.error("Invalid response format");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error fetching accordion data:", error);
            },
        });
    }


    function loggedIn(callback) {
        $.ajax({
            type: "GET",
            url: "php/session.php",
            dataType: "json",
            success: function (res) {
                if (res.status === 200) {
                    // console.log("logged in");
                    // add d-none class to lrbtns div

                    $("#joinedHead").removeClass("d-none")

                    $("#lrBtns").addClass("d-none")
                    $("#loutBtn").removeClass("d-none")
                    var x = res.name.split(" ");
                    var y = x[0];
                    $('#waitname').val(y);

                    $("#regForm").attr("data-userid", res.userid);
                    console.log(res.userid);

                    $("#perDet").html(
                        // `<p class="text-center">Welcome ${res.email}</p>` +
                        // `<p class="text-center">${res.name}</p>`
                        `<h1>Hi ${y}</h1>`
                    );
                    callback(true);
                } else {
                    // console.log("not logged in");
                    $("#joinedHead").addClass("d-none")

                    $("#loutBtn").addClass("d-none")
                    $("#lrBtns").removeClass("d-none")
                    callback(false);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error checking login:", error);
                callback(false);
            },
        });
    }


    function urlCheck() {
        // get url
        var url = new URL(window.location.href);

        // check if "w" parameter is present in the URL
        if (url.searchParams.has("w")) {
            // "w" is present, get waitType
            var waitType = url.searchParams.get("w");

            // set waitType
            $("#waitType").val(waitType);

            // check if "r" parameter is present
            if (url.searchParams.has("r")) {
                // "r" is present, get referal
                var referal = url.searchParams.get("r");
                // set referal
                $("#referal").val(referal);
            }

            // make AJAX request for waitType
            $.ajax({
                type: "GET",
                url: "php/regWaitlist.php",
                dataType: "json",
                data: { waitType: waitType },
                success: function (res) {
                    if (res.status == 200) {
                        // set data-tableid if waitType is valid
                        $("#regForm").attr("data-tableid", res.tableid);
                    } else {
                        // handle invalid waitType
                        handleInvalidWaitType();
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error checking waitType:", error);
                    // handle invalid waitType
                    handleInvalidWaitType();
                },
            });

            // open modal
            $("#waitRegModal").modal("show");
        } else {

            if (url.searchParams.has("r")) {
                // "r" is present, get referal
                var referal = url.searchParams.get("r");
                // set referal
                $("#referal").val(referal);
            } else {
                // "w" is not present, handle accordingly
                var currentUrl = window.location.href;
                // find the index of "?"
                var questionMarkIndex = currentUrl.indexOf("?");
                // check if "?" is present and there are characters after it
                if (questionMarkIndex !== -1 && questionMarkIndex < currentUrl.length - 1) {
                    // characters are present after "?", clean the URL
                    var cleanUrl = currentUrl.substring(0, questionMarkIndex);
                    window.history.replaceState({}, document.title, cleanUrl);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        showCloseButton: true,
                        text: "Invalid URL!",
                    });
                }
            }
        }
    }

    function handleInvalidWaitType() {
        // clean the URL
        var url = window.location.href;
        var cleanUrl = url.substring(0, url.indexOf("?"));
        window.history.replaceState({}, document.title, cleanUrl);

        // clear all fields of modal
        $("#waitType").val("");

        // close modal
        $("#waitRegModal").modal("hide");
        console.log("modal closed");

        // show error message
        Swal.fire({
            icon: "error",
            title: "Oops...",
            showCloseButton: true,
            text: "Invalid Item!",
        });
    }




    /* ------------------------- autorun ----------------------------------------------*/

    // check url contains any parameters
    urlCheck();
    // Fetch data on document ready
    fetchData();
    // already logged in ?
    loggedIn(function (isLoggedIn) {
        // console.log(isLoggedIn);
    });

    /* ---------------------------------------------------------------------------------*/



    /* -------------------------------- other functions ---------------------------------------*/
    $("#copyLinkBtn").click(myFunction1);
    function myFunction1() {
        // Get the text field
        var copyText = document.getElementById("link");

        // Select the text field
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText.value);

        Swal.fire({
            icon: "success",
            title: "Copied"
        });
    }


    $("#copyRefBtn").click(myFunction2);
    function myFunction2() {
        // Get the text field
        var copyText = document.getElementById("code");

        // Select the text field
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText.value);

        Swal.fire({
            icon: "success",
            title: "Copied"
        });
    }


    /* ------------------------------end of other functions------------------------------------*/



    // -------------------------------other ajax requests---------------------------------

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
                    // console.log("Login successful with email:", res.email);
                    localStorage.setItem("email", res.email);
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        showCloseButton: true,
                        text: res.message,
                    });
                    $("#loginModal").modal("hide");
                    fetchData();
                    loggedIn(function (isLoggedIn) {
                        // console.log(isLoggedIn);
                    });
                } else if (res.status == 207) {
                    Swal.fire({
                        icon: "success",
                        title: "Admin Login",
                        showCloseButton: true,
                        text: res.message,
                    }).then(function () {
                        window.location.href = "admin.html";
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
                console.log(res.status);
                console.log(res.message);
                if (res.status == 200) {
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
                    localStorage.removeItem("email");
                    $('#perDet').load(' #perDet');
                    fetchData();

                    loggedIn(function (isLoggedIn) {
                        // console.log(isLoggedIn);
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        showCloseButton: true,
                        text: res.message,
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


    $("#regForm").submit(function (event) {
        event.preventDefault();

        urlCheck();


        // here i was having some issues with the table id
        // when i try to access the table id like any other ways like data("tableid") or attr("data-tableid") it was returning wrong value
        // i had to reload the page to get the correct value
        // but somehow when i check the current assigned value to the tableid it was correct
        // so i had to use this method to get the correct value
        var tableid;
        var userid;
        var element = document.getElementById("regForm");
        if (element) {
            var attributes = element.attributes;
            for (var i = 0; i < attributes.length; i++) {
                var attributeName = attributes[i].name;
                var attributeValue = attributes[i].value;

                console.log("first consoling:", attributeName + ": " + attributeValue);

                // Check for specific attributes and assign values to variables
                if (attributeName === "data-tableid") {
                    tableid = attributeValue;
                } else if (attributeName === "data-userid") {
                    userid = attributeValue;
                }
            }
        }

        var formData = new FormData(this);
        var waitname = $('#waitname').val();
        var waitType = $('#waitType').val();
        // var tableid = $("#regForm").data("tableid");
        // var userid = $(this).data("userid");

        formData.append("tableid", tableid);
        formData.append("waitname", waitname);
        formData.append("waitType", waitType);
        formData.append("userid", userid);

        console.log(formData);

        $.ajax({
            type: "POST",
            url: "php/regWaitlist.php",
            data: formData,
            dataType: "json",
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        showCloseButton: true,
                        text: res.message,
                    });
                    $("#waitRegModal").modal("hide");

                    addTable(tableid);
                    fetchData();
                    console.log("Registration successful");
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

    // Use a static parent container that exists on page load
    $("#joinedAccordionWait").on("click", ".shareBtn", function (event) {
        console.log("Share button with id:", $(this).data("tableid"));
        var waitType = $(this).data("type");
        var uid;

        // ajax to fetch user id from the session
        $.ajax({
            type: "GET",
            url: "php/session.php",
            dataType: "json",
            success: function (res) {
                if (res.status === 200) {
                    uid = res.userid;

                    // generate a link with the waitType and uid
                    var link = "http://localhost/waitlist/?w=" + waitType + "&r=" + uid;

                    // set the value of the input field
                    $("#link").val(link);
                    $("#code").val(uid);

                    // open the modal
                    $("#shareModal").modal("show");
                } else {
                    Swal.fire({
                        icon: "info",
                        title: "Oops...",
                        showCloseButton: true,
                        text: "Please login to share!",
                    });
                }
            }
        });
    });

    //--------------------------------------------------------------------------------------


});


