# Project Report

## Introduction

Ce projet vise à développer un système de surveillance et de gestion du traffic urbain. Nous avons utilisé des données issue de capteurs afin de calculer des statistiques de traffic et proposer des chemins alternatifs pour les usagers.

## Méthodologie

Nous avons suivi les étapes suivantes pour mener à bien ce projet:

1. **Documentation**: Nous avons commencé par documenter les exigences du projet et les objectifs à atteindre.
2. **Collect de données**: Nous avons mis en place des capteurs afin de simuler la collecte de données de traffic.
3. **Intégration**: Nous avons mis en place la récupération des données des capteurs et le calcul des statistiques de traffic.
4. **Déploiement**: Nous avons déployé un système de CI/CD pour automatiser les tests et le déploiement de notre application avec Docker et Kubernetes.
5. **Présentation**: Nous avons préparé une présentation pour partager les résultats de notre projet.

## Exigences Fontionelles

### Scope du projet

- Récupérer des données de capteurs
- Calculer des statistiques de traffic
- Proposer ou non des chemins alternatifs
- Afficher les données de traffic en temps réel

### Hors du scope

- Poser les capteurs et assurer leur maintenance
- Servir de GPS pour les usagers
- Annalyser la conduite des usagers
- Gérer / notifier les incidents de traffic
  
### Dashboard

L'utilisateur doit pouvoir visualiser les données de traffic en temps réel(plus ou moins): routes principales, secondaires et les zones de congestion. Les routes sont colorées en fonction du niveau de traffic(vert pour fluide, jaune pour modéré, rouge pour congestionné). Un panneau latéral affiche les statistiques de traffic en temps réel et les recommandations de chemins alternatifs.

### Chemins alternatifs

L'utilisateur doit pouvoir recevoir des recommandations de chemins alternatifs en cas de congestion. Ces recommandations sont basées sur les données de traffic en temps réel et les statistiques calculées.

## Exigences Techniques

### Technologies utilisées

- **Backend**: MQTT, Go, Raspberry Pi(virtuelle pour simuler les capteurs)
- **Frontend**: NodeJS, D3.js
- **CI/CD**: GitHub Actions, Docker, Kubernetes
- **Documentation**: Markdown, Mermaid
- **Version Control**: Git
- **Project Management**: GitHub Projects
- **Maintenance du service**: Grafana, Prometheus
- **Database**: TimeScaleDB

### Architecture

L'architecture de notre système est composé de plusieurs composants:

- **Capteurs**: Simulé par des Raspberry Pi virtuels, ils collectent les données de traffic et les envoient via MQTT.
- **Backend**: Il reçoit les données des capteurs, calcule les statistiques de traffic et propose des chemins alternatifs.
- **Frontend** Il affiche les données de traffic en temp réel et les recommandations de chemins alternatifs.
- **CI/CD**: Automatisation des tests et du déploiement de l'application avec Docker et Kubernetes.
- **Monitoring**: Grafana et Prometheus sont utilisés pour surveiller les performances du système et détecter les anomalies.
- **Database**: TimeScaleDB est utilisé pour stocker les données de traffic et les statistiques calculées.

### Diagramme d'architecture

Le diagramme d'architecture de notre système est dans le fichier [project-architecture.md](/docs/project-architecture.md).

### Capteurs

Nous avons utilisé des Raspberry Pi virtuels pour simuler les capteurs de traffic.Chaque capteur collecte le nombre de vehicules passant par une route spécifique et envoie ces données via MQTT a un broker central, puis le backend récupère ces données pour les analyser et calculer les statistiques de traffic.

### Backend
