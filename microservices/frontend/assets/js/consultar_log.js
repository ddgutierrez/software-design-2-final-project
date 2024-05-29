async function fetchLogData() {
  const idNumberInput = document.getElementById('searchNumeroDocumento');
  const date = document.getElementById('searchFecha').value;
  const action = document.getElementById('tipoAccion').value;
  const logResults = document.getElementById('logResults');
  logResults.innerHTML = ''; // Clear previous results
  console.log(date);

  // Validate the idNumberInput against the pattern \d{1,10}
  const idNumberPattern = /^\d{0,10}$/;
  if (!idNumberPattern.test(idNumberInput.value)) {
    alert('Número de Documento debe contener entre 1 y 10 dígitos.');
    return;
  }

  const idNumber = idNumberInput.value;

const url = new URL('http://localhost:8000/log/');
const params = {};

console.log(idNumber);
console.log(date);
console.log(action);
if (idNumber) params.idNumber = idNumber;
if (date) params.date = date;
if (action) params.action = action;
Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
console.log(url);
  try{
    fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 500) {
        alert('Error al obtener los datos: ' + data.message);
        throw new Error("Error del servidor");
      } else {
        console.error('Error:', error);
        alert('Error al conectar con el servidor.');
        throw new Error("Error al crear la persona");
      }
    }).then(data => { 
        console.log(data);
        if (data.length === 0) {
          logResults.innerHTML = '<p>No logs found</p>';
        } else {
          logResults.innerHTML = `
            <table>
              <thead>
                <tr>
                  <th>Número de Documento</th>
                  <th>Acción</th>
                  <th>Fecha de Creación</th>
                </tr>
              </thead>
              <tbody>
                ${data.map(log => `
                  <tr>
                    <td>${log.idNumber}</td>
                    <td>${log.action}</td>
                    <td>${new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;
        }
    });
  } catch (error) {
    console.error('Error:', error);
    alert('Error al conectar con el servidor.');
  }
}
