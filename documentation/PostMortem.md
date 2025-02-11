# Post Mortem - Tournament Manager

## Éléments non implémentés

### Général
- Utilisation de l'extension ["TODO"](https://marketplace.cursorapi.com/items?itemName=Gruntfuggly.todo-tree) sur VSCode pour recenser dans le codes certaines recommandations dans le développement.

### Front-end

#### Configuration et Tests
- Linter correctement configuré
  - ESLint n'a pas été configuré de manière optimale
  - Règles de style et bonnes pratiques à définir

- Tests Cypress
  - Tests end-to-end non implémentés
  - Scénarios de test à définir pour les principaux parcours utilisateur
  - Configuration de l'environnement de test à faire

#### Fonctionnalités
- Authentification
  - Système de login/register non implémenté 
  - Gestion des sessions utilisateur
  - Protection des routes privées
  - Gestion des rôles et permissions

- Classement des équipes
  - Système de points basé sur les donjons complétés

### Back-end

#### Configuration
- Linter correctement configuré
  - ESLint à configurer pour Node.js
  - Standards de code à définir
  - Règles de validation à mettre en place

#### Fonctionnalités
- Authentification
  - Endpoints sécurisés à implémenter
  - Gestion des JWT ou sessions
  - Validation des tokens
  - Middleware d'authentification

### Scripts

#### Automatisation
- Scripts de mise en place non automatisés
  - Installation des dépendances
  - Configuration de l'environnement
  - Initialisation de la base de données
  - Déploiement

## Éléments mis en place

- Interface utilisateur complète pour la gestion des tournois
- Gestion des équipes et des personnages
- API REST fonctionnelle
- Script de création de la base de données
- Logging des opérations
- Gestion des erreurs
- Documentation MPD (Modèle Physique des Données)
- Documentation de l'architecture du projet
- Documentation du WBS (Work Breakdown Structure)

## Difficultés rencontrées

- Difficulté à la mise en place correcte de la base de données
- Difficulté à la mise en place de mocks pour les tests unitaires et fonctionnels

## Recommandations pour les futurs développeurs

- Implémenter l'authentification en priorité
- Mettre en place les tests de bout en bout avec cypress
- Finaliser la mise en place des linters

