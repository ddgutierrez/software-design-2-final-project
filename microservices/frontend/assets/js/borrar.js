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

  function deleteUser(idNumber) {
    fetch("http://localhost:8000/delete/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idNumber: idNumber }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to delete persona");
        }
      })
      .then((data) => {
        console.log("Updated Data:", data);
        alert("Persona borrada con éxito!");
        location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error: " + error.message);
      });
  }
});
