// State indicating whether we should reinitialize the table
let reinitialize = true;

// Copy button text
const COPY_BUTTON_TEXT = 'Melding kopi&euml;ren';

function initialize() {
    // Find all alert tables and add a copy button
    document.querySelectorAll('table#alerts').forEach(elem => {
        const tableRow = document.createElement('tr');
        tableRow.classList.add('custom-tr');
        tableRow.innerHTML = `<td colspan="3"></td><td><button class="copy-alert">${COPY_BUTTON_TEXT}</button></td>`;
        elem.querySelector('tbody').append(tableRow);
    });
}

// Initialize
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
observer.observe(document.querySelector('#divContentAlerts'), {
    childList: true,
    attributes: false,
});

// Get element parents
function parents(el, selector) {
    const parents = [];
    while ((el = el.parentNode) && el !== document) {
        if (!selector || el.matches(selector)) parents.push(el);
    }
    return parents;
}

// Handle copy alert click
document.addEventListener('click', event => {
    if (!event.target.closest('.copy-alert')) {
        return;
    }

    // Make sure we don't reinitialize the table
    reinitialize = false;

    // Clone the clicked button's parent table
    const clonedTable = parents(event.target, 'table')[0].cloneNode(true);

    // Remove the last tr (copy button tr)
    clonedTable.querySelector('tr.custom-tr').remove();

    // Remove alert-blink classes
    clonedTable.querySelectorAll('a.alert-blink').forEach(elem => {
        elem.classList.remove('alert-blink');
    });

    // Append the table to the alerts overview
    document.querySelector('#divContentAlerts').append(clonedTable);

    // Remove any selections from the current document
    window.getSelection().removeAllRanges();

    // Create a range for the cloned table and select it
    var range = document.createRange();
    range.selectNode(clonedTable);
    window.getSelection().addRange(range);

    // Execute the copy command
    document.execCommand('copy');

    // Remove the cloned table
    clonedTable.remove();
});
