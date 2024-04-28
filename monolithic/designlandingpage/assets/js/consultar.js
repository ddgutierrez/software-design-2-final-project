function fetchUserData() {
    const numeroDocumento = document.getElementById('searchNumeroDocumento').value;

    const bodyContent = JSON.stringify({
        idNumber: numeroDocumento
    });

    fetch('http://localhost:3000/api/user/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: bodyContent
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            const userData = data[0];
            document.getElementById('primerNombre').value = userData.firstName || '';
            document.getElementById('segundoNombre').value = userData.middleName || '';
            document.getElementById('apellidos').value = userData.lastName || '';
            document.getElementById('fechaNacimiento').value = userData.birthDate ? new Date(userData.birthDate).toISOString().split('T')[0] : '';
            document.getElementById('genero').value = userData.gender || '';
            document.getElementById('email').value = userData.email || '';
            document.getElementById('celular').value = userData.phone || '';
            document.getElementById('numeroDocumento').value = userData.idNumber || '';
            document.getElementById('tipoDocumento').value = userData.idType || ''; // Assuming you also want to display the document type
            console.log('User found');
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Error al buscar el usuario: ' + error.message);
    });
}