async function fetchLogData() {
    const idNumber = document.getElementById('searchNumeroDocumento').value;
    const date = document.getElementById('searchFecha').value;
    const logResults = document.getElementById('logResults');
    logResults.innerHTML = ''; // Clear previous results
  
    const url = `http://localhost:8000/log/`; // Fetch all logs
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
  
      if (response.ok) {
        // Filter logs based on user input
        const filteredData = data.filter(log => {
          let matchesIdNumber = true;
          let matchesDate = true;
          
          if (idNumber) {
            matchesIdNumber = log.idNumber.toString() === idNumber;
          }
          
          if (date) {
            const logDate = new Date(log.createdAt).toISOString().split('T')[0];
            matchesDate = logDate === date;
          }
          
          return matchesIdNumber && matchesDate;
        });
  
        if (filteredData.length === 0) {
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
                ${filteredData.map(log => `
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
      } else {
        alert('Error al obtener los datos: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor.');
    }
  }
  