document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("buscarPersonaForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const idNumber = document.getElementById("searchNumeroDocumento").value;
    fetchUserData(idNumber);
  });

  // Expresiones regulares para validaciones
  const regexNumDocumento = /^\d{1,10}$/;

  // Obtener elementos de entrada
  const numDocumentoInput = document.getElementById("searchNumeroDocumento");

  // Agregar eventos de escucha para validaciones en tiempo real
  numDocumentoInput.addEventListener("keypress", function (event) {
    validarInput(this, regexNumDocumento, event);
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

  window.fetchUserData = function () {
    const idNumber = document.getElementById("searchNumeroDocumento").value;
    fetch("http://localhost:8000/read/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idNumber: idNumber }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          throw new Error("Número de documento no existe");
        } else {
          throw new Error("Failed to update persona data");
        }
      })
      .then((data) => {
        if (data.length > 0) {
          if (document.getElementById("actualizarPersonaForm")) {
            populateFormData(data[0]);
          } else {
            displayUserData(data[0]);
          }
        } else {
          alert("No data found for the provided ID number");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error: " + error.message);
      });
  };

  function populateFormData(data) {
    document.getElementById("tipoDocumento").value = data.idType;
    document.getElementById("primerNombre").value = data.firstName;
    document.getElementById("segundoNombre").value = data.middleName;
    document.getElementById("apellidos").value = data.lastName;
    document.getElementById("fechaNacimiento").value =
      data.birthDate.split("T")[0];
    document.getElementById("genero").value = data.gender;
    document.getElementById("email").value = data.email;
    document.getElementById("celular").value = data.phone;
    // Note: Photo is not populated here since it's a file input
  }

  function displayUserData(data) {
    document.getElementById("primerNombre").innerText = data.firstName;
    document.getElementById("segundoNombre").innerText = data.middleName;
    document.getElementById("apellidos").innerText = data.lastName;
    document.getElementById("fechaNacimiento").innerText =
      data.birthDate.split("T")[0];
    document.getElementById("genero").innerText = data.gender;
    document.getElementById("email").innerText = data.email;
    document.getElementById("celular").innerText = data.phone;
    document.getElementById("numeroDocumento").innerText = data.idNumber;
    document.getElementById("tipoDocumento").innerText = data.idType;
  }
});
