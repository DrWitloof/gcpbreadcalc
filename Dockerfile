# Gebruik een lichte Python-basisafbeelding
FROM python:3.9-slim

# Stel een werkdirectory in
WORKDIR /app

# Kopieer alleen de vereisten om de afhankelijkheden te installeren
COPY requirements.txt requirements.txt

# Installeer de afhankelijkheden (cache-vriendelijk)
RUN pip install --no-cache-dir -r requirements.txt

# Kopieer alleen de app-code (voorkomt invalidatie van afhankelijkheden-cache)
COPY . .

# Specificeer de startcommando voor de applicatie
CMD ["python", "app.py"]
