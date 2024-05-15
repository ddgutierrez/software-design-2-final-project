document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("borrarPersonaForm");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const idNumber = document.getElementById("searchNumeroDocumento").value;
      deleteUser(idNumber);
    });
  
    function deleteUser(idNumber) {
  
      fetch('http://localhost:8000/delete/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idNumber: idNumber }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to delete persona');
          }
        })
        .then((data) => {
          console.log('Updated Data:', data);
          alert('Persona borrada con éxito!');
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('Error: ' + error.message);
        });
    }
  });
  