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

/** @typedef {import('./belong_to.mjs')} BelongToService - Manages belong_to-related operations */
import * as belongTo from "./belong_to.mjs"

/** @typedef {import('./players.mjs')} PlayersService - Manages player data and player-related operations */
import * as players from "./players.mjs"

/** @typedef {import('./donjons.mjs')} DonjonsService - Manages donjon data and donjon-related operations */
import * as donjons from "./donjons.mjs"

/** @typedef {import('./donjons_done.mjs')} DonjonsDoneService - Manages donjon_done data and donjon_done-related operations */
import * as donjonsDone from "./donjons_done.mjs"

export {
    user,
    tournament,
    teams,
    characters,
    compose,
    registered,
    belongTo,
    players,
    donjons,
    donjonsDone
}