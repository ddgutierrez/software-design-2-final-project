document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("actualizarPersonaForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const idNumber = document.getElementById("searchNumeroDocumento").value;
    updateUserData(idNumber);
  });

  function updateUserData(idNumber) {
    const formData = {
      idNumber: idNumber,
      firstName: document.getElementById("primerNombre").value,
      middleName: document.getElementById("segundoNombre").value,
      lastName: document.getElementById("apellidos").value,
      birthDate: document.getElementById("fechaNacimiento").value,
      gender: document.getElementById("genero").value,
      email: document.getElementById("email").value,
      phone: parseInt(document.getElementById("celular").value, 10),
    };

    fetch('http://localhost:8000/update/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to update persona data');
        }
      })
      .then((data) => {
        console.log('Updated Data:', data);
        alert('Persona actualizada con éxito!');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error: ' + error.message);
      });
  }
});
