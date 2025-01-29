document.addEventListener('DOMContentLoaded', () => {
    const clientForm = document.getElementById('client-form');
    const clientsTableBody = document.getElementById('clients-table').querySelector('tbody');
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const cancelEditButton = document.getElementById('cancel-edit');

    let clients = [];
    let nextId = 1;

    clientForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = generateUniqueId();
        const name = clientForm.name.value.trim();
        const email = clientForm.email.value.trim();
        const phone = clientForm.phone.value.trim();

        if (validateClient(name, email, phone)) {
            const client = {
                id,
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
            const clientIndex = event.target.dataset.index;
            const client = clients[clientIndex];
            if (client) {
                openEditModal(client, clientIndex);
            }
        } else if (event.target.classList.contains('delete-button')) {
            const clientIndex = event.target.dataset.index;
            const client = clients[clientIndex];
            const enteredId = prompt('Introduce el ID del cliente para confirmar la eliminación:');
            if (enteredId == client.id) {
                if (confirm('¿Está seguro de que desea eliminar este contacto?')) {
                    clients.splice(clientIndex, 1);
                    renderClients();
                }
            } else {
                alert('ID incorrecto. No se ha eliminado el cliente.');
            }
        }
    });

    editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const index = editForm['edit-index'].value;
        const name = editForm['edit-name'].value.trim();
        const email = editForm['edit-email'].value.trim();
        const phone = editForm['edit-phone'].value.trim();

        if (validateClient(name, email, phone, index)) {
            clients[index] = { ...clients[index], name, email, phone };
            renderClients();
            closeEditModal();
        }
    });

    cancelEditButton.addEventListener('click', () => {
        closeEditModal();
    });

    function generateUniqueId() {
        return Math.floor(10000 + Math.random() * 90000).toString();
    }

    function validateClient(name, email, phone, currentIndex = -1) {
        if (!name || !email || !phone) {
            alert('Todos los campos son obligatorios.');
            return false;
        }
        const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!namePattern.test(name)) {
            alert('Nombre no válido. Solo se permiten letras y espacios.');
            return false;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            alert('Email no válido.');
            return false;
        }
        if (clients.some((c, index) => c.email === email && index !== currentIndex)) {
            if (currentIndex === -1 || clients[currentIndex].email !== email) {
                alert('El email ya está registrado.');
                return false;
            }
        }
        const phonePattern = /^\+?\d{0,3}?\s?\d{9}$/;
        if (!phonePattern.test(phone)) {
            alert('Teléfono no válido. Solo se permiten caracteres numéricos, espacios y prefijos de país.');
            return false;
        }
        return true;
    }

    function renderClients() {
        clientsTableBody.innerHTML = '';
        clients.forEach((client, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.id}</td>
                <td>${client.name}</td>
                <td>${client.email}</td>
                <td>${client.phone}</td>
                <td>
                    <button class="action-button edit-button" data-index="${index}">Editar</button>
                    <button class="action-button delete-button" data-index="${index}">Eliminar</button>
                </td>
            `;
            clientsTableBody.appendChild(row);
        });
    }

    function openEditModal(client, index) {
        editForm['edit-index'].value = index;
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