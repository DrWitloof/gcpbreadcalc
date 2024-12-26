from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/bereken', methods=['POST'])
def bereken():
    data = request.json
    aantal_broden = int(data['aantalBroden'])
    gewicht_brood = int(data['gewichtBrood'])
    hydratie = float(data['hydratie']) / 100
    inocculatie = float(data['inocculatie']) / 100

    # Berekeningen
    totaal_deeg = aantal_broden * gewicht_brood * 1.1
    totaal_bloem = totaal_deeg / (1 + hydratie)
    totaal_water = totaal_bloem * hydratie
    desem = totaal_deeg * inocculatie
    bloem = totaal_bloem - (desem / 2)
    water = totaal_water - (desem / 2)
    zout = totaal_bloem * 0.02

    return jsonify({
        'totaalDeeg': round(totaal_deeg, 2),
        'totaalBloem': round(totaal_bloem, 2),
        'totaalWater': round(totaal_water, 2),
        'bloem': round(bloem, 2),
        'water': round(water, 2),
        'desem': round(desem, 2),
        'zout': round(zout, 2)
    })

if __name__ == '__main__':
    app.run(debug=True)
