document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('userForm');
    const usersContainer = document.getElementById('usersContainer');
    
    // Load users on page load
    loadUsers();
    
    // Form submission
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addUser();
    });
    
    // Add user function
    function addUser() {
        const name = document.getElementById('name').value;
        const dateOfBirth = document.getElementById('dateOfBirth').value;
        const address = document.getElementById('address').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        
        fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                date_of_birth: dateOfBirth,
                address: address,
                phone_number: phoneNumber
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('User added:', data);
            loadUsers();
            userForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    // Load users function
    function loadUsers() {
        fetch('/users')
        .then(response => response.json())
        .then(users => {
            displayUsers(users);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    // Display users function
    function displayUsers(users) {
        usersContainer.innerHTML = '';
        
        if (users.length === 0) {
            usersContainer.innerHTML = '<p>No users found. Add your first user!</p>';
            return;
        }
        
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
                <h3>${user.name}</h3>
                <div class="user-info">
                    <p><strong>Date of Birth:</strong> ${user.date_of_birth}</p>
                    <p><strong>Phone:</strong> ${user.phone_number}</p>
                    <p><strong>Address:</strong> ${user.address}</p>
                    <p><strong>Added:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
            `;
            usersContainer.appendChild(userCard);
        });
    }
    
    // Delete user function (global so it can be called from HTML)
    window.deleteUser = function(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            fetch(`/users/${userId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                console.log('User deleted:', data);
                loadUsers();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    };
});