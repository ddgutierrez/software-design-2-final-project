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

  //Funcion para manejar formato correcto de fecha
  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }  

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

  window.fetchUserData = async function () {
    const idNumber = document.getElementById("searchNumeroDocumento").value;

    try {
      const response = await fetch("http://localhost:8000/read/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idNumber: idNumber })
      });
      if(response.ok) {
        const data = await response.json();
        if (document.getElementById("actualizarPersonaForm")) {
          populateFormData(data[0]);
        } else {
          displayUserData(data[0]);
        }
      } else if (response.status === 404) {
        throw new Error("El número de documento no existe");
      } else if (response.status === 503) {
        throw new Error("read-ms no está disponible");
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
  };

  function populateFormData(data) {
    document.getElementById("tipoDocumento").value = data.idType;
    document.getElementById("primerNombre").value = data.firstName;
    if(typeof data.middleName === 'undefined' || data.middleName === ''){
      document.getElementById("segundoNombre").value = '';
    }else{
      document.getElementById("segundoNombre").value = data.middleName;
    }
    document.getElementById("apellidos").value = data.lastName;
    document.getElementById("fechaNacimiento").value =
      data.birthDate.split("T")[0];
    document.getElementById("genero").value = data.gender;
    document.getElementById("email").value = data.email;
    document.getElementById("celular").value = data.phone;
    document.getElementById("foto").src = data.photo;
    // Note: Photo is not populated here since it's a file input
  }

  function displayUserData(data) {
    document.getElementById("primerNombre").innerText = data.firstName;
    if (typeof data.middleName === 'undefined' || data.middleName === '') {
      document.getElementById("segundoNombre").innerText = '';
    } else {
      document.getElementById("segundoNombre").innerText = data.middleName;
    }
    document.getElementById("apellidos").innerText = data.lastName;
    document.getElementById("fechaNacimiento").innerText = formatDate(data.birthDate.split("T")[0]);
    document.getElementById("genero").innerText = data.gender;
    document.getElementById("email").innerText = data.email;
    document.getElementById("celular").innerText = data.phone;
    document.getElementById("numeroDocumento").innerText = data.idNumber;
    document.getElementById("tipoDocumento").innerText = data.idType;

    // Mostrar la foto
    const photoElement = document.getElementById("foto");
    if (data.photo) {
      photoElement.src = `data:image/jpeg;base64,${data.photo}`;
      photoElement.style.display = "block";
    } else {
      photoElement.style.display = "none";
    }
  }
});
