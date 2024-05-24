document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("actualizarPersonaForm");
  const limpiarButton = document.getElementById("limpiar");
  const form1 = document.getElementById("buscarPersonaForm");

  form1.addEventListener("submit", function (event) {
    event.preventDefault();
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

  // Recuperar valores del sessionStorage si existen
  const inputs = [
    numDocumentoInput,
    primerNombreInput,
    segundoNombreInput,
    apellidosInput,
    emailInput,
    celularInput,
    generoInput,
    fechaInput,
  ];

  if (!sessionStorage.getItem("formCleared")) {
    inputs.forEach((input) => {
      const savedValue = sessionStorage.getItem(input.id);
      if (savedValue) {
        input.value = savedValue;
      }

      // Guardar el valor en el sessionStorage cuando cambie
      input.addEventListener("input", () => {
        sessionStorage.setItem(input.id, input.value);
      });
    });
  } else {
    // Remover el indicador después de la primera carga post limpieza
    sessionStorage.removeItem("formCleared");
    location.reload();
  }

  // Expresiones regulares para validaciones
  const regexNumDocumento = /^\d{1,10}$/;
  const regexNombres = /^[A-Za-z\s]{1,30}$/;
  const regexApellidos = /^[A-Za-z\s]{1,60}$/;
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

  window.fetchUserDataEditar = function () {
    const idNumber = document.getElementById("searchNumeroDocumento1").value;
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
          populateFormData(data[0]); // Llenar los datos del formulario
          // Guardar los datos en sessionStorage
          sessionStorage.setItem("userData", JSON.stringify(data[0]));
        } else {
          alert(
            "No se encontraron datos para el número de identificación proporcionado"
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error: " + error.message);
      });
  };

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
    // Guardar los valores en sessionStorage
    sessionStorage.setItem("tipoDocumento1", userData.idType);
    sessionStorage.setItem("primerNombre1", userData.firstName);
    sessionStorage.setItem("segundoNombre1", userData.middleName);
    sessionStorage.setItem("apellidos1", userData.lastName);
    sessionStorage.setItem(
      "fechaNacimiento1",
      userData.birthDate.split("T")[0]
    );
    sessionStorage.setItem("genero1", userData.gender);
    sessionStorage.setItem("email1", userData.email);
    sessionStorage.setItem("celular1", userData.phone);
  }

  // // Verificar si hay datos almacenados en sessionStorage al cargar la página
  // window.addEventListener("DOMContentLoaded", function () {
  //   const storedUserData = sessionStorage.getItem("userData");
  //   if (storedUserData) {
  //     const userData = JSON.parse(storedUserData);
  //     populateFormData(userData);
  //   }
  // });

  // Restaurar los valores del sessionStorage en los campos del formulario
  document.addEventListener("DOMContentLoaded", function () {
    const tipoDocumentoInput = document.getElementById("tipoDocumento1");
    const primerNombreInput = document.getElementById("primerNombre1");
    const segundoNombreInput = document.getElementById("segundoNombre1");
    const apellidosInput = document.getElementById("apellidos1");
    const fechaInput = document.getElementById("fechaNacimiento1");
    const generoInput = document.getElementById("genero1");
    const emailInput = document.getElementById("email1");
    const celularInput = document.getElementById("celular1");

    tipoDocumentoInput.value = sessionStorage.getItem("tipoDocumento1");
    primerNombreInput.value = sessionStorage.getItem("primerNombre1");
    segundoNombreInput.value = sessionStorage.getItem("segundoNombre1");
    apellidosInput.value = sessionStorage.getItem("apellidos1");
    fechaInput.value = sessionStorage.getItem("fechaNacimiento1");
    generoInput.value = sessionStorage.getItem("genero1");
    emailInput.value = sessionStorage.getItem("email1");
    celularInput.value = sessionStorage.getItem("celular1");

    // Guardar los valores en sessionStorage cuando cambien
    const inputs = [
      tipoDocumentoInput,
      primerNombreInput,
      segundoNombreInput,
      apellidosInput,
      fechaInput,
      generoInput,
      emailInput,
      celularInput,
    ];
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        sessionStorage.setItem(input.id, input.value);
      });
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const idNumber = numDocumentoInput.value;
    const fileInput = document.getElementById("foto1");
    const file = fileInput.files[0];

    if (file && file.size > 2097152) {
      alert("El tamaño de la foto debe ser menor de 2 MB.");
      return;
    } else {
      toBase64(file)
        .then((base64String) => {
          console.log("Foto en Base64:", base64String); // Verificar la conversión a Base64

          updateUserData(idNumber, base64String);
        })
        .catch((error) => {
          console.error(error);
        });
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

  function updateUserData(idNumber, base64String) {


    const formData = {
      idNumber: idNumber,
      firstName: document.getElementById("primerNombre1").value,
      middleName: document.getElementById("segundoNombre1").value,
      lastName: document.getElementById("apellidos1").value,
      birthDate: document.getElementById("fechaNacimiento1").value,
      gender: document.getElementById("genero1").value,
      email: document.getElementById("email1").value,
      phone: parseInt(document.getElementById("celular1").value, 10),
      photo: base64String,
    };

    fetch("http://localhost:8000/update/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to update persona data");
        }
      })
      .then((data) => {
        console.log("Updated Data:", data);
        alert("Persona actualizada con éxito!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error: " + error.message);
      });
  }
});
