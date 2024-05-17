document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("actualizarPersonaForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const idNumber = document.getElementById("searchNumeroDocumento").value;
    updateUserData(idNumber);
  });

  // Expresiones regulares para validaciones
  const regexNombres = /^[A-Za-z\s]{1,30}$/;
  const regexApellidos = /^[A-Za-z\s]{1,60}$/;
  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const regexCelular = /^\d{1,10}$/;

  // Obtener elementos de entrada
  const primerNombreInput = document.getElementById("primerNombre");
  const segundoNombreInput = document.getElementById("segundoNombre");
  const apellidosInput = document.getElementById("apellidos");
  const emailInput = document.getElementById("email");
  const celularInput = document.getElementById("celular");

  // Agregar eventos de escucha para validaciones en tiempo real
  primerNombreInput.addEventListener("keypress", function (event) {
    validarInput(this, regexNombres, event);
  });

  segundoNombreInput.addEventListener("keypress", function (event) {
    validarInput(this, regexNombres, event);
  });

  apellidosInput.addEventListener("keypress", function (event) {
    validarInput(this, regexApellidos, event);
  });

  emailInput.addEventListener("input", function (event) {
    validarInput(this, regexEmail, event);
  });

  celularInput.addEventListener("keypress", function (event) {
    validarInput(this, regexCelular, event);
  });


  function validarInput(input, regex, event) {
    const key = event.key;
    const valor = input.value + key;
    const isValid = regex.test(valor);
  
    if (!isValid) {
      event.preventDefault();
      input.classList.add("invalid");
    } else {
      input.classList.remove("invalid");
    }
  }
  

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
