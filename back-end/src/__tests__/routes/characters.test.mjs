import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';

// First mock the services module
jest.unstable_mockModule('../../services/index.mjs', () => ({
    characters: {
        getCharacters: jest.fn(),
        getCharacterById: jest.fn(),
        createCharacter: jest.fn(),
        updateCharacter: jest.fn(),
        deleteCharacter: jest.fn()
    },
    teams: {},
    user: {},
    tournament: {},
    compose: {},
    registered: {}
}));

// Import after mocking
const services = await import('../../services/index.mjs');
const mockCharacterService = services.characters;
let app;

// Mock authentication middleware
jest.unstable_mockModule('../../middleware/authentification.mjs', () => ({
    default: (req, res, next) => {
        req.user = { id: '123' };
        next();
    }
}));

// Import app after mocking middleware
app = (await import('../../index.mjs')).default;
import request from 'supertest';

describe('Characters Routes', () => {
    // Mock data
    const mockCharacters = [
        { id: '1', name: 'Character 1', role_id: 1, class_id: 1, ilvl: 400, rio: 2000 },
        { id: '2', name: 'Character 2', role_id: 2, class_id: 2, ilvl: 410, rio: 2100 }
    ];

    beforeEach(() => {
        // Clear mock calls before each test
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /characters', () => {
        it('should return all characters', async () => {
            // Setup mock return value
            mockCharacterService.getCharacters.mockResolvedValue(mockCharacters);

            const response = await request(app)
                .get('/characters')
                .expect(200);

            expect(response.body).toEqual(mockCharacters);
            expect(mockCharacterService.getCharacters).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /characters/:id', () => {
        it('should return a character by id', async () => {
            const mockCharacter = mockCharacters[0];
            mockCharacterService.getCharacterById.mockResolvedValue(mockCharacter);

            const response = await request(app)
                .get(`/characters/${mockCharacter.id}`)
                .expect(200);

            expect(response.body).toEqual(mockCharacter);
            expect(mockCharacterService.getCharacterById).toHaveBeenCalledWith(mockCharacter.id.toString());
        });

        it('should return 404 if character not found', async () => {
            mockCharacterService.getCharacterById.mockResolvedValue(null);

            await request(app)
                .get('/characters/999')
                .expect(404);

            expect(mockCharacterService.getCharacterById).toHaveBeenCalledWith('999');
        });
    });

    describe('POST /characters', () => {
        it('should create a new character', async () => {
            const newCharacter = {
                name: 'New Character',
                role_id: 1,
                class_id: 1,
                ilvl: 400,
                rio: 2000
            };
            mockCharacterService.createCharacter.mockResolvedValue({ id: '3', ...newCharacter });

            const response = await request(app)
                .post('/characters')
                .send(newCharacter)
                .expect(200);

            expect(response.body).toEqual({ id: '3', ...newCharacter });
            expect(mockCharacterService.createCharacter).toHaveBeenCalledWith(newCharacter, '123');
        });

        it('should return 400 if required fields are missing', async () => {
            const incompleteCharacter = {
                name: 'New Character'
                // Missing required fields
            };

            await request(app)
                .post('/characters')
                .send(incompleteCharacter)
                .expect(400);

            expect(mockCharacterService.createCharacter).not.toHaveBeenCalled();
        });
    });
});
