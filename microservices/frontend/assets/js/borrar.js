document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("borrarPersonaForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const idNumber = document.getElementById("searchNumeroDocumento").value;
    deleteUser(idNumber);
  });

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

  async function deleteUser(idNumber) {
    try {
      const response = await fetch("http://localhost:8000/delete/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idNumber: idNumber })
      });
      if(response.ok) {
        alert("Persona borrada con éxito!");
        location.reload();
      } else if (response.status === 404) {
        throw new Error("El número de documento no existe");
      } else if (response.status === 503) {
        throw new Error("delete-ms no está disponible");
      } else if (response.status === 504) {
        throw new Error("la base de datos no está disponible");
      } else {
        throw new Error("Unknown Error");
      }
    } catch (error) {
      if(error.message === "Failed to fetch") {
        alert("Error: api-gateway no está disponible");
      }else{
        alert("Error: " + error.message);
      }
    }
  }
});
