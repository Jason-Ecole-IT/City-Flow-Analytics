# Conventions

This document outlines the coventions followed during this project and throughout the codebase to ensure consistency and maintainability.

## Files and Directories

### Folder Naming Conventions

> [!TIP]
>
> - `Good Practice`: Use concise and descriptive names with `snake_case` for folders.
>
> ```md
> documents
> data_models
> ```

<br>

> [!Caution]
>
> - `Bad Practice`: Avoid using spaces, special characters, or overly long names for folders.
>
> ```md
> My Documents
> data models
> ```

### File Naming Conventions

> [!TIP]
>
> - `Good Practice`: Use `kebab-case` for files with clear and descriptive names.
>
> ```md
> user-profile.json
> data-model.py
> ```

<br>

> [!Caution]
>
> - `Bad Practice`: Avoid using camelCase, spaces, or special characters in file names.
>
> ```md
> a.json
> dataModel.py
> ```

<br>

## Coding Standards

### Variables

> [!Tip]
>
> - `Good Practice`: Use descriptive names in snake_case for variables.
>
> ```python
> user_count = 10
> usernames = ["alice", "bob", "charlie"]
>```

<br>

> [!Caution]
>
> - `Bad Practice`: Avoid using single-letter names or ambiguous terms for variables.
>
> ```python
> a = 10
> list = ["alice", "bob", "charlie"]
> ```

### Functions

> [!Tip]
>
> - `Good Practice`: Use descriptive names in snake_case for functions.
>
> ```python
> get_user_count()
> format_data()
> ```

<br>

> [!Caution]
>
> - `Bad Practice`: Avoid using generic names or ambiguous terms for functions.
>
> ```python
> func()
> array()
>```
