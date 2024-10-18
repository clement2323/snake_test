# Utiliser une image Python légère
FROM python:3.9-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY app.py .
COPY static ./static

# Installer les dépendances
RUN pip install flask

# Exposer le port
EXPOSE 5000

# Démarrer l'application
CMD ["python", "app.py"]
