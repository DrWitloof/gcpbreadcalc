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
        aantalBroden: data.aantalBroden,
        gewichtBrood: data.gewichtBrood,
        clean: data.clean,
        resultaten: {
          water: result.water,
          desem: result.desem,
          zout: result.zout,
          bloem: result.bloem,
          totaalBloem: result.totaalBloem,
          totaalWater: result.totaalWater,
          totaalDeeg: result.totaalDeeg,
          hydratatie: ((result.totaalWater / result.totaalBloem) * 100).toFixed(2),
          inoculatie: ((result.desem / result.totaalBloem) * 100).toFixed(2)
        }
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

        const cellAantalBroden = document.createElement('td');
        cellAantalBroden.textContent = parsedValue.aantalBroden || '-';
        row.appendChild(cellAantalBroden);

        const cellGewichtBrood = document.createElement('td');
        cellGewichtBrood.textContent = parsedValue.gewichtBrood || '-';
        row.appendChild(cellGewichtBrood);

        const cellClean = document.createElement('td');
        cellClean.textContent = parsedValue.clean ? 'Ja' : 'Nee';
        row.appendChild(cellClean);

        const cellWater = document.createElement('td');
        cellWater.textContent = parsedValue.resultaten?.water || '-';
        row.appendChild(cellWater);

        const cellDesem = document.createElement('td');
        cellDesem.textContent = parsedValue.resultaten?.desem || '-';
        row.appendChild(cellDesem);

        const cellZout = document.createElement('td');
        cellZout.textContent = parsedValue.resultaten?.zout || '-';
        row.appendChild(cellZout);

        const cellBloem = document.createElement('td');
        cellBloem.textContent = parsedValue.resultaten?.bloem || '-';
        row.appendChild(cellBloem);

        const cellTotaalBloem = document.createElement('td');
        cellTotaalBloem.textContent = parsedValue.resultaten?.totaalBloem || '-';
        row.appendChild(cellTotaalBloem);

        const cellTotaalWater = document.createElement('td');
        cellTotaalWater.textContent = parsedValue.resultaten?.totaalWater || '-';
        row.appendChild(cellTotaalWater);

        const cellTotaalDeeg = document.createElement('td');
        cellTotaalDeeg.textContent = parsedValue.resultaten?.totaalDeeg || '-';
        row.appendChild(cellTotaalDeeg);

        const cellHydratatie = document.createElement('td');
        cellHydratatie.textContent = parsedValue.resultaten?.hydratatie || '-';
        row.appendChild(cellHydratatie);

        const cellInoculatie = document.createElement('td');
        cellInoculatie.textContent = parsedValue.resultaten?.inoculatie || '-';
        row.appendChild(cellInoculatie);

        opslagContainer.appendChild(row);
      }
    } catch (e) {
      // Als de waarde geen JSON is, toon een melding in een aparte rij
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 13; // Maak de cel breed genoeg voor alle kolommen
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
