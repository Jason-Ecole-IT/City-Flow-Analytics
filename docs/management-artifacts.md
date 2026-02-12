# Management Artifacts – Projet de Simulation de Trafic Urbain

## 1. Introduction

Ce document présente les principaux artefacts de management du projet de simulation de trafic urbain. L’objectif du projet est de développer une application interactive permettant de visualiser l’état du trafic entre différentes intersections et de calculer le meilleur chemin en fonction de l’affluence.

Ces artefacts ont pour but de clarifier les rôles, d’anticiper les risques, de structurer l’organisation du travail et de définir des indicateurs de succès.

## 2. Description du projet

Le projet consiste à développer une application web comprenant :

- Une carte interactive affichant des intersections et des routes
- Une simulation dynamique du trafic (valeurs de 0 à 100)
- Un dashboard visuel avec jauges de trafic
- Un algorithme de calcul de chemin optimal (Dijkstra)
- Une mise à jour en temps réel des données

### Objectifs principaux

- Représenter visuellement un réseau routier urbain
- Adapter dynamiquement les routes selon l’affluence
- Calculer le meilleur itinéraire en fonction du trafic
- Fournir une interface claire et intuitive

## 3. Matrice RACI

La matrice RACI définit les rôles et responsabilités pour chaque tâche clé du projet.

| Lettre | Signification | Description                       |
| ------ | ------------- | --------------------------------- |
| R      | Responsable   | Exécute la tâche                  |
| A      | Accountable   | Responsable final du résultat     |
| C      | Consulté      | Fournit des conseils ou expertise |
| I      | Informé       | Tenu informé de l’avancement      |

### Rôles du projet

- **Chef de projet** : coordination globale
- **Développeur frontend** : interface utilisateur et visualisation
- **Développeur backend/algorithmique** : logique de calcul et routage
- **Équipe test** : validation fonctionnelle
- **Parties prenantes** : utilisateurs ou encadrants

### Matrice RACI détaillée

| Tâche / Livrable                           | R              | A              | C                    | I                 |
| ------------------------------------------ | -------------- | -------------- | -------------------- | ----------------- |
| Modélisation du réseau routier             | Dev backend    | Chef de projet | Dev frontend         | Parties prenantes |
| Implémentation de l’algorithme de routage  | Dev backend    | Chef de projet | Équipe test          | Parties prenantes |
| Développement de la carte interactive      | Dev frontend   | Chef de projet | Dev backend          | Parties prenantes |
| Création du dashboard visuel               | Dev frontend   | Chef de projet | UX / équipe test     | Parties prenantes |
| Intégration et synchronisation des données | Équipe dev     | Chef de projet | Équipe test          | Parties prenantes |
| Tests fonctionnels et validation           | Équipe test    | Chef de projet | Équipe dev           | Parties prenantes |
| Présentation finale                        | Toute l’équipe | Chef de projet | Direction de l'école | Parties prenantes |

## 4. Gestion des risques

Le tableau suivant identifie les risques principaux du projet et les stratégies d’atténuation.

| Risque                                          | Probabilité | Impact | Stratégie d’atténuation                          |
| ----------------------------------------------- | ----------- | ------ | ------------------------------------------------ |
| Erreur dans l’algorithme de routage             | Moyenne     | Élevé  | Tests unitaires, validation sur scénarios connus |
| Superposition ou mauvaise lisibilité des routes | Moyenne     | Moyen  | Ajustement visuel, tests UX                      |
| Problèmes de performance du navigateur          | Moyenne     | Élevé  | Optimisation du rendu et limitation du refresh   |
| Données de trafic instables                     | Moyenne     | Moyen  | Lissage des valeurs, moyenne glissante           |
| Retards de développement                        | Moyenne     | Élevé  | Suivi hebdomadaire et planification réaliste     |
| Manque de communication dans l’équipe           | Moyenne     | Élevé  | Réunions régulières et outils collaboratifs      |
| Problèmes techniques avec les outils            | Faible      | Élevé  | Documentation et entraide entre membres          |

## 5. Architecture du projet

Le système est structuré en plusieurs composants :

### Frontend

- Carte interactive (Leaflet)
- Dashboard visuel
- Interaction utilisateur

### Backend logique

- Modélisation du graphe routier
- Algorithme de Dijkstra
- Simulation du trafic

### Flux de données

1. Génération des valeurs de trafic
2. Mise à jour du graphe
3. Calcul du chemin optimal
4. Affichage sur la carte et le dashboard

## 6. Planification générale

Le projet est organisé en phases :

1. **Analyse et conception** : définition du réseau et de l’architecture
2. **Développement initial** : affichage carte et intersections
3. **Implémentation du routage** : algorithme et logique trafic
4. **Interface utilisateur** : dashboard et visualisation
5. **Tests et optimisation**
6. **Documentation et présentation**

## 7. Indicateurs de performance (KPIs)

Pour mesurer le succès du projet :

- Temps de calcul du chemin < 100 ms
- Mise à jour du trafic stable et fluide
- Interface lisible et réactive
- Exactitude du routage
- Absence d’erreurs critiques

## 8. Conclusion

Ces artefacts de management permettent de structurer efficacement le projet de simulation de trafic. Ils assurent une répartition claire des responsabilités, une anticipation des risques et un suivi mesurable des performances.

Le projet combine des aspects techniques avancés (algorithmique, visualisation, simulation) avec une organisation structurée, favorisant sa réussite.
