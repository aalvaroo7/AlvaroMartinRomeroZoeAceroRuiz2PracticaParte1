document.addEventListener('DOMContentLoaded', () => {
    const clientForm = document.getElementById('client-form');
    const clientsTableBody = document.getElementById('clients-table').querySelector('tbody');
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const cancelEditButton = document.getElementById('cancel-edit');

    let clients = [];

    clientForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = clientForm.name.value.trim();
        const email = clientForm.email.value.trim();
        const phone = clientForm.phone.value.trim();

        if (validateClient(name, email, phone)) {
            const client = {
                id: Date.now(),
                name,
                email,
                phone
            };
            clients.push(client);
            renderClients();
            clientForm.reset();
        }
    });

    clientsTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-button')) {
            const clientId = event.target.dataset.id;
            const client = clients.find(c => c.id == clientId);
            if (client) {
                openEditModal(client);
            }
        } else if (event.target.classList.contains('delete-button')) {
            const clientId = event.target.dataset.id;
            clients = clients.filter(c => c.id != clientId);
            renderClients();
        }
    });

    editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = editForm['edit-id'].value;
        const name = editForm['edit-name'].value.trim();
        const email = editForm['edit-email'].value.trim();
        const phone = editForm['edit-phone'].value.trim();

        if (validateClient(name, email, phone, id)) {
            const clientIndex = clients.findIndex(c => c.id == id);
            clients[clientIndex] = { id: Number(id), name, email, phone };
            renderClients();
            closeEditModal();
        }
    });

    cancelEditButton.addEventListener('click', () => {
        closeEditModal();
    });

    function validateClient(name, email, phone, id = null) {
        if (!name || !email || !phone) {
            alert('Todos los campos son obligatorios.');
            return false;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Email no válido.');
            return false;
        }
        if (clients.some(c => c.email === email && c.id != id)) {
            alert('El email ya está registrado.');
            return false;
        }
        return true;
    }

    function renderClients() {
        clientsTableBody.innerHTML = '';
        clients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.id}</td>
                <td>${client.name}</td>
                <td>${client.email}</td>
                <td>${client.phone}</td>
                <td>
                    <button class="action-button edit-button" data-id="${client.id}">Editar</button>
                    <button class="action-button delete-button" data-id="${client.id}">Eliminar</button>
                </td>
            `;
            clientsTableBody.appendChild(row);
        });
    }

    function openEditModal(client) {
        editForm['edit-id'].value = client.id;
        editForm['edit-name'].value = client.name;
        editForm['edit-email'].value = client.email;
        editForm['edit-phone'].value = client.phone;
        editModal.classList.remove('hidden');
        editModal.classList.add('visible');
    }

    function closeEditModal() {
        editModal.classList.remove('visible');
        editModal.classList.add('hidden');
    }
});