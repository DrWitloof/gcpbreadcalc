document.getElementById('opslaanKnop').addEventListener('click', function() {
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
      // Bereken de hydratatie en inocculatie percentages
      const gegevensOmOpTeSlaan = {
        vraag: `${data.aantalBroden}x${data.gewichtBrood}${data.clean?"(clean)"}`,
        recept:  `${result.water}g water
${result.desem}g desem
${result.zout}g zout
${result.bloem}g bloem`,
        totalen: `${result.totaalWater}g water
${result.totaalBloem}g bloem
${result.totaalDeeg}g deeg`,
        percentages: `hydratatie: ${((result.totaalWater / result.totaalBloem) * 100).toFixed(2)}%
inoculatie: ${((result.desem / result.totaalBloem) * 100).toFixed(2)}%`
      };

      // Sla het object op in localStorage
      localStorage.setItem('broodOpslag', JSON.stringify(gegevensOmOpTeSlaan));
      alert('De huidig berekende gegevens zijn opgeslagen in de lokale opslag!');
    })
    .catch(error => {
      console.error("Fout bij het ophalen van resultaten:", error);
    });
});

function toonOpslag() {
  const opslagContainer = document.getElementById('opslag-body');
  opslagContainer.innerHTML = ''; // Leeg de huidige opslagweergave

  // Itereer door alle items in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const sleutel = localStorage.key(i);
    const waarde = localStorage.getItem(sleutel);

    try {
      // Parse de waarde als JSON
      const parsedValue = JSON.parse(waarde);

      // Controleer of de waarde een object is
      if (typeof parsedValue === 'object' && parsedValue !== null) {
        const row = document.createElement('tr');

        // Voeg de velden toe aan de juiste kolommen
        const cellSleutel = document.createElement('td');
        cellSleutel.textContent = sleutel;
        row.appendChild(cellSleutel);

        const celVraag = document.createElement('td');
        celVraag.textContent = parsedValue.vraag || '-';
        row.appendChild(celVraag);

        const celRecept = document.createElement('td');
        celRecept.textContent = parsedValue.recept || '-';
        row.appendChild(celRecept);

        const celTotalen = document.createElement('td');
        celTotalen.textContent = parsedValue.totalen || '-';
        row.appendChild(celTotalen);
        
        const celPercentages = document.createElement('td');
        celPercentages.textContent = parsedValue.percentages || '-';
        row.appendChild(celPercentages);

        opslagContainer.appendChild(row);
      }
    } catch (e) {
      // Als de waarde geen JSON is, toon een melding in een aparte rij
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 5; // Maak de cel breed genoeg voor alle kolommen
      cell.textContent = `Onbekend formaat voor sleutel: ${sleutel}`;
      row.appendChild(cell);
      opslagContainer.appendChild(row);
    }
  }
}

// Voeg event listener toe aan de "Wis opslag"-knop
document.getElementById('wisOpslagKnop').addEventListener('click', function () {
  if (confirm('Weet je zeker dat je alle opgeslagen gegevens wilt wissen?')) {
    localStorage.clear();
    alert('Alle opgeslagen gegevens zijn gewist!');
    toonOpslag(); // Vernieuw de opslagweergave
  }
});

// Toon opslag bij laden van de pagina
document.addEventListener('DOMContentLoaded', function () {
  toonOpslag();
});
