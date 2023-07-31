const userForm = document.getElementById('userForm');
const dataTable = document.getElementById('dataTable');
const noDataMessage = document.getElementById('noDataMessage');
const exportModal = document.getElementById('exportModal');
const jsonData = document.getElementById('jsonData');
const closeExportModal = document.getElementById('closeExportModal');

userForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const surname = document.getElementById('surname').value.trim();
    const email = document.getElementById('email').value.trim();
    const age = parseInt(document.getElementById('age').value.trim(), 10);
    const favoriteColor = document.getElementById('favoriteColor').value;
    const contactPreference = getSelectedContactPreferences();

    if (!validateForm(name, surname, email, age, contactPreference)) {
        return;
    }

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${name}</td>
        <td>${surname}</td>
        <td>${email}</td>
        <td>${age}</td>
        <td>${favoriteColor}</td>
        <td>${contactPreference.join(', ')}</td>
        <td><button class="deleteButton">Delete</button></td>
    `;

    dataTable.querySelector('tbody').appendChild(newRow);

    updateTableVisibility();
    resetFormFields();
});

dataTable.addEventListener('click', function (event) {
    if (event.target.classList.contains('deleteButton')) {
        if (confirm('Are you sure you want to delete this row?')) {
            const row = event.target.closest('tr');
            row.remove();
            updateTableVisibility();
        }
    }
});

document.getElementById('closeExportModal').addEventListener('click', function () {
    exportModal.style.display = 'none';
});

function validateForm(name, surname, email, age, contactPreference) {
    if (!name || !surname || !email || !age || !contactPreference.length) {
        alert('All fields are required.');
        return false;
    }

    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    if (age >= 120) {
        alert('Age must be less than 120.');
        return false;
    }

    return true;
}

function isValidEmail(email) {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getSelectedContactPreferences() {
    const checkboxes = document.getElementsByName('contactPreference');
    const selectedPreferences = [];
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedPreferences.push(checkbox.value);
        }
    });
    return selectedPreferences;
}

function updateTableVisibility() {
    const tableRows = dataTable.querySelectorAll('tbody tr');
    if (tableRows.length === 0) {
        dataTable.style.display = 'none';
        noDataMessage.style.display = 'block';
    } else {
        dataTable.style.display = 'table';
        noDataMessage.style.display = 'none';
    }
}

function resetFormFields() {
    userForm.reset();
}

document.getElementById('exportButton').addEventListener('click', function () {
    const tableData = [];
    const rows = dataTable.querySelectorAll('tbody tr');

    rows.forEach((row) => {
        const rowData = {
            Name: row.cells[0].textContent,
            Surname: row.cells[1].textContent,
            Email: row.cells[2].textContent,
            Age: row.cells[3].textContent,
            'Favorite Color': row.cells[4].textContent,
            'Contact Preference': row.cells[5].textContent,
        };
        tableData.push(rowData);
    });

    jsonData.textContent = JSON.stringify(tableData, null, 2);
    exportModal.style.display = 'block';
});
