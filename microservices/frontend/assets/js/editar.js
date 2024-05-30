document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("actualizarPersonaForm");
  const limpiarButton = document.getElementById("limpiar");
  const buscarButton = document.getElementById("buscarButton");
  const form1 = document.getElementById("buscarPersonaForm");
  let originalData = {};

  buscarButton.addEventListener("click", function () {
    const idNumber = document.getElementById("searchNumeroDocumento1").value;
    fetchUserDataEditar(idNumber);
  });

  limpiarButton.addEventListener("click", function (event) {
    event.preventDefault();
    limpiarFormulario();
  });

  function limpiarFormulario() {
    const inputs = [
      document.getElementById("searchNumeroDocumento1"),
      document.getElementById("primerNombre1"),
      document.getElementById("segundoNombre1"),
      document.getElementById("apellidos1"),
      document.getElementById("email1"),
      document.getElementById("celular1"),
      document.getElementById("fechaNacimiento1"),
      document.getElementById("foto1"),
      document.getElementById("genero1"),
    ];

    inputs.forEach((input) => {
      if (input.id == "genero1") {
        input.value = "Masculino";
      } else {
        input.value = "";
      }
      sessionStorage.removeItem(input.id);
    });

    // Marcar que los campos fueron limpiados
    sessionStorage.setItem("formCleared", "true");
  }

  // Obtener elementos de entrada
  const numDocumentoInput = document.getElementById("searchNumeroDocumento1");
  const tipoDocumentoInput = document.getElementById("tipoDocumento1");
  const primerNombreInput = document.getElementById("primerNombre1");
  const segundoNombreInput = document.getElementById("segundoNombre1");
  const apellidosInput = document.getElementById("apellidos1");
  const emailInput = document.getElementById("email1");
  const celularInput = document.getElementById("celular1");
  const generoInput = document.getElementById("genero1");
  const fechaInput = document.getElementById("fechaNacimiento1");

  async function fetchUserDataEditar(idNumber) {
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
        populateFormData(data[0]); // Llenar los datos del formulario
        originalData = data[0];
        
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
  }

  // Asegúrate de que la función esté disponible globalmente
  window.fetchUserDataEditar = fetchUserDataEditar;

  // Función para llenar los campos del formulario
  function populateFormData(userData) {
    document.getElementById("tipoDocumento1").value = userData.idType;
    document.getElementById("primerNombre1").value = userData.firstName;
    document.getElementById("segundoNombre1").value = userData.middleName;
    document.getElementById("apellidos1").value = userData.lastName;
    document.getElementById("fechaNacimiento1").value =
      userData.birthDate.split("T")[0];
    document.getElementById("genero1").value = userData.gender;
    document.getElementById("email1").value = userData.email;
    document.getElementById("celular1").value = userData.phone;
  }

  // Comparar los valores del formulario con los datos originales
  function getChangedFields() {
    const changedFields = {};
    if (originalData.idType !== tipoDocumentoInput.value) {
      changedFields.idType = tipoDocumentoInput.value;
    }
    if (originalData.firstName !== primerNombreInput.value) {
      changedFields.firstName = primerNombreInput.value;
    }
    if (originalData.middleName !== segundoNombreInput.value) {
      changedFields.middleName = segundoNombreInput.value;
    }
    if (originalData.lastName !== apellidosInput.value) {
      changedFields.lastName = apellidosInput.value;
    }
    if (originalData.birthDate.split("T")[0] !== fechaInput.value) {
      changedFields.birthDate = fechaInput.value;
    }
    if (originalData.gender !== generoInput.value) {
      changedFields.gender = generoInput.value;
    }
    if (originalData.email !== emailInput.value) {
      changedFields.email = emailInput.value;
    }
    if (originalData.phone !== celularInput.value) {
      changedFields.phone = celularInput.value;
    }
    return changedFields;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const idNumber = document.getElementById("searchNumeroDocumento1").value;
    const fileInput = document.getElementById("foto1");
    const file = fileInput.files[0];

    if (file && file.size > 2097152) {
      alert("El tamaño de la foto debe ser menor de 2 MB.");
      return;
    } else if (file) {
      toBase64(file)
        .then((base64String) => {
          updateUserData(idNumber, base64String);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      updateUserData(idNumber);
    }
  });

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result.split(",")[1]); // Obteniendo solo la cadena base64
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  async function updateUserData(idNumber, base64String = null) {
    if(Object.keys(originalData).length === 0){
      originalData.birthDate = "2000-01-01T00:00:00.000Z";
    }
    const formData = getChangedFields();
    formData.idNumber = idNumber;

    if (base64String) {
      formData.photo = base64String;
    }
    console.log(formData);
    try {
      const response = await fetch("http://localhost:8000/update/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if(response.ok) {
        alert("Persona actualizada con éxito!");
      } else if (response.status === 404) {
        throw new Error("El número de documento no existe");
      } else if (response.status === 503) {
        throw new Error("update-ms no está disponible");
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

  // Expresiones regulares para validaciones
  const regexNumDocumento = /^\d{1,10}$/;
  const regexNombres = /^[A-Za-zñÑ][A-Za-zñÑ\s]{0,29}$/;
  const regexApellidos = /^[A-Za-zñÑ][A-Za-zñÑ\s]{0,59}$/;
  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const regexCelular = /^\d{1,10}$/;

  // Agregar eventos de escucha para validaciones en tiempo real
  numDocumentoInput.addEventListener("keypress", function (event) {
    validarInput(this, regexNumDocumento, event);
  });

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
});
