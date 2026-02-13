FROM python:3.11-slim

WORKDIR /app

# Copier toutes les dépendances si tu as un requirements.txt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le code Python
COPY . .

# Default command
CMD ["python", "subscriber.py"]
