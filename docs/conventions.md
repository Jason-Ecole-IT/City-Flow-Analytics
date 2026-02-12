# Conventions

Ce document présente les conventions suivies durant ce projet et dans l'ensemble du code afin d'assurer cohérence et maintenabilité.

## Fichiers et répertoires

### Conventions de nommage des dossiers

> [!TIP]
>
> - `Bonne pratique` : Utilisez des noms concis et descriptifs en `snake_case` pour les dossiers.
>
> ```md
> documents
> data_models
> ```

<br>

> [!ATTENTION]
>
> - `Mauvaise pratique` : Évitez les espaces, les caractères spéciaux ou des noms trop longs pour les dossiers.
>
> ```md
> My Documents
> data models
> ```

### Conventions de nommage des fichiers

> [!TIP]
>
> - `Bonne pratique` : Utilisez le `kebab-case` pour les fichiers avec des noms clairs et descriptifs.
>
> ```md
> user-profile.json
> data-model.py
> ```

<br>

> [!ATTENTION]
>
> - `Mauvaise pratique` : Évitez d'utiliser le camelCase, des espaces ou des caractères spéciaux dans les noms de fichiers.
>
> ```md
> a.json
> dataModel.py
> ```

<br>

## Normes de codage - Backend

### Variables

> [!TIP]
>
> - `Bonne pratique` : Utilisez des noms descriptifs en snake_case pour les variables.
>
> ```python
> user_count = 10
> usernames = ["alice", "bob", "charlie"]
>```

<br>

> [!ATTENTION]
>
> - `Mauvaise pratique` : Évitez les noms d'une seule lettre ou des termes ambigus pour les variables.
>
> ```python
> a = 10
> list = ["alice", "bob", "charlie"]
> ```

### Fonctions

> [!TIP]
>
> - `Bonne pratique` : Utilisez des noms descriptifs en snake_case pour les fonctions.
>
> ```python
> get_user_count()
> format_data()
> ```

<br>

> [!ATTENTION]
>
> - `Mauvaise pratique` : Évitez d'utiliser des noms génériques ou ambigus pour les fonctions.
>
> ```python
> func()
> array()
>```

### Constantes

> [!TIP]
>
> - `Bonne pratique` : Utilisez des majuscules avec des underscores pour les constantes.
>
> ```python
> MAX_USERS = 100
> DEFAULT_TIMEOUT = 30
> ```

<br>

> [!ATTENTION]
>
> - `Mauvaise pratique` : Évitez d'utiliser des minuscules ou un mélange de casse pour les constantes.
>
> ```python
> maxUsers = 100
> defaultTimeout = 30
> ```

### Package

> [!TIP]
>
> - `Bonne pratique` : Utilisez des noms de package en minuscules et en un seul mot.
>
> ```go
> package user
> import "fmt"
>```

<br>

> [!ATTENTION]
>
> - `Mauvaise pratique` : Évitez les lettres majuscules, les espaces ou les caractères spéciaux dans les noms de package.
>
> ```go
> package User
> import "$fmt"
>```
