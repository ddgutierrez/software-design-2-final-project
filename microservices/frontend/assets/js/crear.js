document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("crearPersonaForm");
  const limpiarButton = document.getElementById("limpiar");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const fileInput = document.getElementById("foto");
    const file = fileInput.files[0];

    if (file && file.size > 2097152) {
      alert("El tamaño de la foto debe ser menor de 2 MB.");
      return;
    } else {
      toBase64(file)
        .then((base64String) => {
          sendData(base64String);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });

  limpiarButton.addEventListener("click", function (event) {
    event.preventDefault();
    limpiarFormulario();
  });

  function limpiarFormulario() {
    const inputs = [
      document.getElementById("numeroDocumento"),
      document.getElementById("primerNombre"),
      document.getElementById("segundoNombre"),
      document.getElementById("apellidos"),
      document.getElementById("email"),
      document.getElementById("celular"),
      document.getElementById("fechaNacimiento"),
      document.getElementById("foto"),
      document.getElementById("tipoDocumento"),
      document.getElementById("genero"),
    ];

    inputs.forEach((input) => {
      if (input.id == "genero") {
        input.value = "Masculino";
      } else if (input.id == "tipoDocumento") {
        input.value = "Tarjeta de identidad";
      } else {
        input.value = "";
      }
      sessionStorage.removeItem(input.id);
    });

    sessionStorage.setItem("formCleared", "true");
  }

  const regexNumDocumento = /^\d{1,10}$/;
  const regexNombres = /^[A-Za-zñÑ][A-Za-zñÑ\s]{0,29}$/;
  const regexApellidos = /^[A-Za-zñÑ][A-Za-zñÑ\s]{0,59}$/;
  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const regexCelular = /^\d{1,10}$/;

  const tipoDocumentoInput = document.getElementById("tipoDocumento");
  const numDocumentoInput = document.getElementById("numeroDocumento");
  const primerNombreInput = document.getElementById("primerNombre");
  const segundoNombreInput = document.getElementById("segundoNombre");
  const generoInput = document.getElementById("genero");
  const fechaInput = document.getElementById("fechaNacimiento");
  const apellidosInput = document.getElementById("apellidos");
  const emailInput = document.getElementById("email");
  const celularInput = document.getElementById("celular");

  const inputs = [
    tipoDocumentoInput,
    numDocumentoInput,
    primerNombreInput,
    segundoNombreInput,
    generoInput,
    fechaInput,
    apellidosInput,
    emailInput,
    celularInput,
  ];

  if (!sessionStorage.getItem("formCleared")) {
    inputs.forEach((input) => {
      const savedValue = sessionStorage.getItem(input.id);
      if (savedValue) {
        input.value = savedValue;
      }

      input.addEventListener("input", () => {
        sessionStorage.setItem(input.id, input.value);
      });
    });
  } else {
    sessionStorage.removeItem("formCleared");
    location.reload();
  }

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

  function sendData(base64String) {
    const formData = {
      idType: document.getElementById("tipoDocumento").value,
      idNumber: parseInt(document.getElementById("numeroDocumento").value, 10),
      firstName: document.getElementById("primerNombre").value,
      lastName: document.getElementById("apellidos").value,
      birthDate: document.getElementById("fechaNacimiento").value,
      gender: document.getElementById("genero").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("celular").value,
      photo: base64String,
    };
    const middleName = document.getElementById("segundoNombre").value;
    console.log(middleName);
    if (middleName) {
      formData.middleName = middleName;
    }else{
      formData.middleName = "";
    }
    console.log("Datos del formulario:", formData);
    submitForm(formData);
  }

  async function submitForm(formData) {
    try {
      const response = await fetch("http://localhost:8000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Response:", response.json());
        alert("Persona creada con éxito!");
      } else if (response.status === 400) {
        throw new Error("El número de documento ya existe");
      } else if (response.status === 503) {
        throw new Error("create-ms no está disponible");
      } else if (response.status === 504) {
        throw new Error("la base de datos no está disponible");
      } else {
        throw new Error("Unknown Error");
      }
    } catch (error) {
      if (error.message === "Failed to fetch") {
        alert("Error: api-gateway no está disponible");
      } else {
        alert("Error: " + error.message);
      }
    }
  }
});
