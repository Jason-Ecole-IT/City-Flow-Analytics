# Project Architecture

## System Design

Le systeme de surveillance et de gestion du traffic urbain est conçu pour collecter des données en temps réel à partir de capteurs installés dans la ville, analyser ces données pour calculer des statistiques de traffic, et proposer des chemins alternatifs aux utilisateurs.

```mermaid
graph TD
    subgraph Data Collection
        A[Capteur]
        B[Capteur]
        C[Capteur]
        D[Broker MQTT]
        end
    subgraph Data Processing
        E[Analyse de données]
        F[Calcul de statistiques]
        G[Chemin alternatif]
        end
    subgraph User Interface
        H[Dashboard Web]
        end
    
    A --> D
    B --> D
    C --> D
    D --> E
    E --> F
    F --> G
    F --> H
    G --> H
```

## Dashboard Mockup

Map de la ville avec les routes principales, les routes secondaires et les zones de congestion. Les routes sont colorées en fonction du niveau de traffic (vert pour fluide, jaune pour modéré, rouge pour congestionné). Un panneau latéral affiche les statistiques de traffic en temps réel et les recommandations de chemins alternatifs.

```mermaid
graph LR
    subgraph Dashboard
        subgraph Stats["Statistiques"]
            D[Statistique de traffic]
            E[Recommandations de chemins alternatifs]
        end
        subgraph Map["Map de la ville"]
            A[Routes principales]
            B[Routes secondaires]
            C[Zones de congestion]
        end
    end
```
