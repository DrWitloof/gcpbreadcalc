from flask import Flask, request, jsonify, render_template
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/healthz')
def health_check():
    return "OK", 200

# Custom rounding function
def custom_round(value):
    if value < 80:
        return 5 * round(value / 5)
    elif value < 150:
        return 10 * round(value / 10)
    else:
        return 50 * round(value / 50)

@app.route('/bereken', methods=['POST'])
def bereken():
    data = request.json
    aantal_broden = int(data['aantalBroden'])
    gewicht_brood = int(data['gewichtBrood'])
    hydratie = float(data['hydratie']) / 100
    inocculatie = float(data['inocculatie']) / 100

    clean = data.get('clean', True)  # Defaults to False if not provided

    # Berekeningen
    totaal_deeg = aantal_broden * gewicht_brood * 1.16
    totaal_bloem = totaal_deeg / (1 + hydratie)
    totaal_water = totaal_bloem * hydratie
    desem = totaal_deeg * inocculatie
    bloem = totaal_bloem - (desem / 2)
    water = totaal_water - (desem / 2)
    zout = totaal_bloem * 0.02

    if clean:
        bloem = custom_round(bloem)
        water = custom_round(water)
        desem = custom_round(desem)
        totaal_bloem = bloem + (desem / 2)
        totaal_water = water + (desem / 2)
        totaal_deeg = totaal_bloem + totaal_water + zout
    
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
    from waitress import serve
    serve(app, host="0.0.0.0", port=8080)
    # app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)), debug=True)

