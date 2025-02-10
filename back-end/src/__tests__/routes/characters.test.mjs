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
const app = (await import('../../index.mjs')).default;
import request from 'supertest';

describe('Characters Routes', () => {
    // Mock data
    const mockCharacters = [
        { id: 1, name: 'Character 1', role_id: 1, class_id: 1, ilvl: 400, rio: 2000 },
        { id: 2, name: 'Character 2', role_id: 2, class_id: 2, ilvl: 410, rio: 2100 }
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
                role_id: 3,
                class_id: 3,
                ilvl: 420,
                rio: 2200
            };
            const createdCharacter = { id: 3, ...newCharacter };
            
            mockCharacterService.createCharacter.mockResolvedValue(createdCharacter);

            const response = await request(app)
                .post('/characters')
                .send(newCharacter)
                .expect(200);

            expect(response.body).toEqual(createdCharacter);
            expect(mockCharacterService.createCharacter).toHaveBeenCalledWith(newCharacter, undefined);
        });
    });

    describe('PUT /characters/:id', () => {
        it('should update an existing character', async () => {
            const characterId = '1';
            const updateData = { name: 'Updated Character' };
            const updatedCharacter = { ...mockCharacters[0], ...updateData };

            // Mock middleware by adding characters to request
            app.use('/characters/:id', (req, res, next) => {
                req.characters = mockCharacters;
                next();
            });

            mockCharacterService.updateCharacter.mockResolvedValue(updatedCharacter);

            const response = await request(app)
                .put(`/characters/${characterId}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toEqual(updatedCharacter);
            expect(mockCharacterService.updateCharacter).toHaveBeenCalledWith({
                ...mockCharacters[0],
                ...updateData
            });
        });

        it('should return 404 if character not found for update', async () => {
            // Mock middleware with empty characters array
            app.use('/characters/:id', (req, res, next) => {
                req.characters = [];
                next();
            });

            await request(app)
                .put('/characters/999')
                .send({ name: 'Updated Character' })
                .expect(404);
        });
    });

    describe('DELETE /characters/:id', () => {
        it('should delete an existing character', async () => {
            const characterId = '1';
            const deletedCharacter = mockCharacters[0];

            // Mock middleware by adding characters to request
            app.use('/characters/:id', (req, res, next) => {
                req.characters = mockCharacters;
                next();
            });

            mockCharacterService.deleteCharacter.mockResolvedValue(deletedCharacter);

            const response = await request(app)
                .delete(`/characters/${characterId}`)
                .expect(200);

            expect(response.body).toEqual(deletedCharacter);
            expect(mockCharacterService.deleteCharacter).toHaveBeenCalledWith(deletedCharacter);
        });

        it('should return 404 if character not found for deletion', async () => {
            // Mock middleware with empty characters array
            app.use('/characters/:id', (req, res, next) => {
                req.characters = [];
                next();
            });

            await request(app)
                .delete('/characters/999')
                .expect(404);
        });
    });
});
