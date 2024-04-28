document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("crearPersonaForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const fileInput = document.getElementById("foto");
    const file = fileInput.files[0];

    if (file && file.size > 2097152) {
      // 2 MB
      alert("El tamaño de la foto debe ser menor de 2 MB.");
      return;
    } else {
      sendData(); // Send without photo metadata
    }
  });

  function sendData(photoMetadata = "") {
    const formData = {
      idType: document.getElementById("tipoDocumento").value, // Matches 'idType' in schema
      idNumber: parseInt(document.getElementById("numeroDocumento").value, 10), // Matches 'idNumber' in schema
      firstName: document.getElementById("primerNombre").value, // Matches 'firstName' in schema
      middleName: document.getElementById("segundoNombre").value, // Matches 'middleName' in schema
      lastName: document.getElementById("apellidos").value, // Matches 'lastName' in schema
      birthDate: document.getElementById("fechaNacimiento").value, // Matches 'birthDate' in schema
      gender: document.getElementById("genero").value, // Matches 'gender' in schema
      email: document.getElementById("email").value, // Matches 'email' in schema
      phone: parseInt(document.getElementById("celular").value, 10), // Matches 'phone' in schema
      photo: "123", //Photo Handling will be coded later
    };

    fetch(form.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to create persona");
        }
      })
      .then((data) => {
        console.log("Response:", data);
        alert("Persona creada con éxito!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error: " + error.message);
      });
  }
});
