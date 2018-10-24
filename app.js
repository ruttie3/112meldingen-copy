// State indicating whether we should reinitialize the table
let reinitialize = true;

// Copy button text
const COPY_BUTTON_TEXT = 'Melding kopi&euml;ren';

function initialize() {
    // Find all alert tables and add a copy button
    $(document).find('table#alerts').each(function() {
        $(this).find('tbody').append(`<tr class="custom-tr"><td colspan="3"></td><td><button class="copy-alert">${COPY_BUTTON_TEXT}</button></td></tr>`);
    });
}

$(document).ready(function() {
    initialize();

    // Create an observer to check for reload of alerts
    const observer = new MutationObserver(function(mutations, observer) {
        // Observer gets triggered when we add html to divContentAlerts, so we check for that here
        if (!reinitialize) {
            reinitialize = true;
            return;
        }

        // Reinitialize
        initialize();
    });

    // Observe the list of alerts
    observer.observe($('#divContentAlerts').get(0), {
        childList: true,
        attributes: false,
    });

    // Handle copy alert click
    $(document).on('click', '.copy-alert', function() {
        // Make sure we don't reinitialize the table
        reinitialize = false;

        // Clone the clicked button's parent table
        const $clonedTable = $(this).parents('table').clone();

        // Remove the last tr (copy button tr) and all alert-blink classes
        $clonedTable.find('tbody tr').last().remove();
        $clonedTable.find('a.alert-blink').removeClass('alert-blink');

        // Append the table to the alerts overview
        $('#divContentAlerts').append($clonedTable);

        // Remove any selections from the current document
        window.getSelection().removeAllRanges();

        // Create a range for the cloned table and select it
        var range = document.createRange();
        range.selectNode($clonedTable.get(0));
        window.getSelection().addRange(range);

        // Execute the copy command
        document.execCommand('copy');

        // Remove the cloned table
        $clonedTable.remove();
    });
});
