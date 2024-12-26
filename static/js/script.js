function bereken() {
  const data = {
    aantalBroden: document.getElementById('aantal-broden').value,
    gewichtBrood: document.getElementById('gewicht-brood').value,
    hydratie: document.getElementById('hydratie').value,
    inocculatie: document.getElementById('inocculatie').value,
    clean: document.getElementById("clean").checked;
  };

  fetch('/bereken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      const outputBody = document.getElementById('output-body');
      outputBody.innerHTML = ''; // Verwijder oude rijen

      // Voeg nieuwe rijen toe met de berekende waarden
      const recepten = [
        { naam: "Bloem", waarde: result.bloem },
        { naam: "Water", waarde: result.water },
        { naam: "Desem", waarde: result.desem, percent: result.totaalWater / result.totaalBloem  },
        { naam: "Zout", waarde: result.zout },
        { naam: "Totale hoeveelheid bloem", waarde: result.totaalBloem },
        { naam: "Totale hoeveelheid water", waarde: result.totaalWater, percent: result.totaalWater / result.totaalBloem },
        { naam: "Totale hoeveelheid deeg", waarde: result.totaalDeeg },
      ];

      recepten.forEach(item => {
        const row = document.createElement('tr');
        const cell1 = document.createElement('td');
        const cell2 = document.createElement('td');
        cell1.textContent = item.naam;
        cell2.textContent = `${item.waarde} g`;
        row.appendChild(cell1);
        row.appendChild(cell2);

        // Check if there's a percent value to add a third cell
        if (item.percent !== undefined) {
          const cell3 = document.createElement('td');
          cell3.textContent = `${(item.percent * 100).toFixed(2)}%`;
          row.appendChild(cell3);
        }
        outputBody.appendChild(row);
      });
    })
    .catch(error => {
      const outputDiv = document.getElementById('output');
      outputDiv.innerHTML = `<p style="color: red;">Er is een fout opgetreden: ${error.message}</p>`;
    });
}

