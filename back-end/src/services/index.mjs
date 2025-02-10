/**
 * @module services
 * @description Collection of service modules that handle business logic and data operations
 */

/** @typedef {import('./user.mjs')} UserService - Handles user-related operations and authentication */
import * as user from "./user.mjs";

/** @typedef {import('./tournament.mjs')} TournamentService - Manages tournament creation, updates, and queries */
import * as tournament from "./tournament.mjs"

/** @typedef {import('./teams.mjs')} TeamsService - Handles team management and team-related operations */
import * as teams from "./teams.mjs"

/** @typedef {import('./characters.mjs')} CharactersService - Manages character data and character-related operations */
import * as characters from "./characters.mjs"

/** @typedef {import('./compose.mjs')} ComposeService - Handles composition of multiple service operations */
import * as compose from "./compose.mjs"

/** @typedef {import('./registered.mjs')} RegisteredService - Manages registration-related operations */
import * as registered from "./registered.mjs"

export { user, tournament, teams, characters, compose, registered }