function bereken() {
  const data = {
    aantalBroden: document.getElementById('aantal-broden').value,
    gewichtBrood: document.getElementById('gewicht-brood').value,
    hydratie: document.getElementById('hydratie').value,
    inocculatie: document.getElementById('inocculatie').value
  };

  fetch('/bereken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      const outputDiv = document.getElementById('output');
      outputDiv.innerHTML = `
        <p>Totaal deeg: ${result.totaalDeeg} g</p>
        <p>Totaal bloem: ${result.totaalBloem} g</p>
        <p>Totaal water: ${result.totaalWater} g</p>
        <p>Bloem: ${result.bloem} g</p>
        <p>Water: ${result.water} g</p>
        <p>Desem: ${result.desem} g</p>
        <p>Zout: ${result.zout} g</p>
      `;
    });
}
