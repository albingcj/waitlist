$(document).ready(function () {
    // Function to create content for the accordion button
    function createAccordionButtonContent(item) {
        var buttonContent = $(
            '<div class="d-flex align-items-center">' +
            '<div class="col d-flex align-items-center">' +
            '<img src="' + item.image + '" alt="' + item.name + '" class="me-2 img-fluid" height="100" width="100" />' +
            '<div>' +
            '<h5 class="mb-0">' + item.name + '</h5>' +
            '<p class="mb-0">' + item.subhead + '</p>' +
            '<div type="button" class="btn btn-primary mt-3 rounded-0 regBtn" data-bs-toggle="modal" data-bs-target="#waitRegModal" data-type="' + item.type + '">Register</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        );

        return buttonContent;
    }

    // Function to create the accordion body
    function createAccordionBody(item) {
        var accordionBody = $(
            '<div id="collapse' + item.id + '" class="accordion-collapse collapse show" data-bs-parent="#accordionWait">' +
            '<div class="accordion-body">' +
            '<div class="row" id="bodyContent">' + item.content + '</div>' +
            '<div class="table-responsive">' +
            '<table class="table table-hover table-borderless text-center border">' +
            '<caption class="text-center">' + item.last_updated + '</caption>' +
            '<thead class="table-dark">' +
            '<tr class="table-danger">' +
            '<th>Rank</th>' +
            '<th>Name</th>' +
            '<th>Points</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody class="table-group-divider" id="tableBody' + item.id + '">' +
            '<tr class="">' +
            '<td scope="row">' + item.rank + '</td>' +
            '<td>' + item.name + '</td>' +
            '<td>' + item.count + '</td>' +
            '</tr>' +
            '</tbody>' +
            '<tfoot>' +
            '<tr class="table-primary" id="tableFooter' + item.id + '">' +
            '<td scope="row">' + item.footer_rank + '</td>' +
            '<td>' + item.footer_name + '</td>' +
            '<td>' + item.footer_count + '</td>' +
            '</tr>' +
            '</tfoot>' +
            '</table>' +
            '</div>' +
            '</div>' +
            '</div>'
        );

        return accordionBody;
    }

    // Function to create a single accordion item
    function createAccordionItem(item) {
        var accordionItem = $('<div class="accordion-item"></div>');
        var accordionHeader = $('<h2 class="accordion-header"></h2>');
        var accordionButton = $('<button class="accordion-button"></button>');

        // Set attributes for the accordion button
        accordionButton.attr({
            'type': 'button',
            'data-bs-toggle': 'collapse',
            'data-bs-target': '#collapse' + item.id,
            'aria-expanded': 'true',
            'aria-controls': 'collapse' + item.id
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

    // Function to fetch data from PHP script
    function fetchData() {
        $.ajax({
            type: 'GET',
            url: 'php/fetch.php',
            dataType: 'json',
            success: function (data) {
                console.log('Data fetched successfully');
                createAccordions(data);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching accordion data:', error);
            }
        });
    }

    // Function to create accordion items dynamically
    function createAccordions(data) {
        var accordionContainer = $('#accordionWait');

        // Clear existing accordion items
        accordionContainer.empty();

        // Iterate through the data and create accordion items
        $.each(data, function (index, item) {
            var accordionItem = createAccordionItem(item);
            accordionContainer.append(accordionItem);
        });

        // Attach click event to dynamically added regBtn
        
        $('.regBtn').click(function (event) {
            console.log('Register button clicked');

            // Access the clicked button using event.target
            var clickedButton = $(event.target);

            // Retrieve the waitType from the clicked button
            var waitType = clickedButton.data('type');

            console.log('waitType: ' + waitType);

            // Set the value of the modal input field
            $('#waitType').val(waitType);

            // Open the modal if it's not open already
            $('#regModal').modal('show');
        });
    }

    // Fetch data on document ready
    fetchData();
});
