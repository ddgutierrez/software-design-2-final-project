document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("actualizarPersonaForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Initialize FormData from the form directly
    const formData = new FormData(form);

    const fileInput = document.getElementById("foto");
    const file = fileInput.files[0];

    if (file && file.size > 2097152) {
      // 2 MB limit check
      alert("El tamaño de la foto debe ser menor de 2 MB.");
      return;
    }

    // Convert non-file fields to the correct format as needed
    formData.set("idNumber", parseInt(formData.get("numeroDocumento"), 10));
    formData.set("phone", parseInt(formData.get("celular"), 10));
    console.log(formData.get("idNumber"));
    idNumber = parseInt(formData.get("numeroDocumento"), 10);
    phone = parseInt(formData.get("celular"), 10);
    
    const bodyContent = JSON.stringify({
      idNumber: document.getElementById('numeroDocumento').value,
      firstName: "SISEÑOR SHAWARMAAA",
    });
    // Assuming 'PATCH' is correct and your server is setup to handle FormData with file upload
    fetch('http://localhost:3000/api/user/update/', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: bodyContent
    })
    //fetch(form.action, {
    //  method: "PATCH",
    //  body: bodyContent,//formData, // Send formData directly without JSON.stringify
    //})
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          alert("Error updating user: " + data.error);
        } else {
          alert("User updated successfully!");
          console.log("Updated user data:", data);
        }
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
        alert("Error updating user: " + error.message);
      });

  });
});
