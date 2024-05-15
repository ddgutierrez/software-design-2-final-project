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
      sendData(); // Send sample data for now
    }
  });

  function sendData() {
    const formData = {
      idType: document.getElementById("tipoDocumento").value,
      idNumber: parseInt(document.getElementById("numeroDocumento").value, 10),
      firstName: document.getElementById("primerNombre").value,
      middleName: document.getElementById("segundoNombre").value,
      lastName: document.getElementById("apellidos").value,
      birthDate: document.getElementById("fechaNacimiento").value,
      gender: document.getElementById("genero").value,
      email: document.getElementById("email").value,
      phone: parseInt(document.getElementById("celular").value, 10),
      photo: "sample photo string", // Placeholder for photo handling
    };

    submitForm(formData);
  }

  function submitForm(formData) {
    fetch("http://localhost:8000/create", {
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
