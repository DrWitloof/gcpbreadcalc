function bereken() {
  const data = {
    aantalBroden: document.getElementById('aantal-broden').value,
    gewichtBrood: document.getElementById('gewicht-brood').value,
    hydratie: document.getElementById('hydratie').value,
    inocculatie: document.getElementById('inocculatie').value,
    clean: document.getElementById("clean").checked,
  };

  fetch('/bereken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      // Bereken de hydratatie en inocculatie
      const hydratatiePercentage = (result.totaalWater / result.totaalBloem) * 100;
      const inoculatiePercentage = (result.desem / result.totaalBloem) * 100;

      const outputBody = document.getElementById('output-body');
      outputBody.innerHTML = ''; // Verwijder oude rijen

      // Voeg nieuwe rijen toe met de berekende waarden
      const recepten = [
        { naam: "Water", waarde: result.water },
        { naam: "Desem", waarde: result.desem },
        { naam: "Zout", waarde: result.zout },
        { naam: "Bloem", waarde: result.bloem },
        { naam: "Totale hoeveelheid water", waarde: result.totaalWater },
        { naam: "Totale hoeveelheid bloem", waarde: result.totaalBloem },
        { naam: "Totale hoeveelheid deeg", waarde: result.totaalDeeg },
        { naam: "Hydratatie", waarde: hydratatiePercentage.toFixed(2) + '%', isPercentage: true },
        { naam: "Inoculatie", waarde: inoculatiePercentage.toFixed(2) + '%', isPercentage: true },
      ];

      recepten.forEach(item => {
        const row = document.createElement('tr');
        const cell1 = document.createElement('td');
        const cell2 = document.createElement('td');
        cell1.textContent = item.naam;

        if (item.isPercentage) {
          cell2.textContent = item.waarde; // Geef de percentage weer
        } else {
          cell2.textContent = `${item.waarde} g`; // Geeft de hoeveelheid weer gevolgd door 'g'
        }
        
        row.appendChild(cell1);
        row.appendChild(cell2);

        outputBody.appendChild(row);
      });
    })
    .catch(error => {
      const outputDiv = document.getElementById('output');
      outputDiv.innerHTML = `<p style="color: red;">Er is een fout opgetreden: ${error.message}</p>`;
    });
}

