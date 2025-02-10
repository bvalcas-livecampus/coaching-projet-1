import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const servicesPath = '../../services';

// First, set up jest to mock modules
jest.unstable_mockModule(servicesPath + '/bdd.mjs', () => ({
    default: {
        query: jest.fn()
    }
}));

// Then import the mocked module and the service we want to test
const { default: pool } = await import(servicesPath + '/bdd.mjs');
const { getCharacters, createCharacter, updateCharacter, deleteCharacter } = await import(servicesPath + '/characters.mjs');

/**
 * Test suite for Character Service
 * Tests CRUD operations for character management including:
 * - Retrieving all characters
 * - Creating new characters with user association
 * - Updating existing characters
 * - Deleting characters
 */
describe('Character Service Tests', () => {
    beforeEach(() => {
        // Clear mock data before each test
        jest.clearAllMocks();
        pool.query.mockReset();
    });

    /**
     * Tests for getCharacters function
     * Verifies the retrieval of all characters from the database
     */
    describe('getCharacters', () => {
        it('should return all characters', async () => {
            // Mock data with clearly fake test values
            const mockCharacters = [
                { 
                    id: 9999, 
                    name: 'TestCharacter1', 
                    role_id: 99, 
                    class_id: 99, 
                    ilvl: 999, 
                    rio: 9999 
                },
                { 
                    id: 8888, 
                    name: 'TestCharacter2', 
                    role_id: 88, 
                    class_id: 88, 
                    ilvl: 888, 
                    rio: 8888 
                }
            ];

            // Setup mock return value
            pool.query.mockResolvedValue({ rows: mockCharacters });

            // Execute function
            const result = await getCharacters();

            // Assertions
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM characters');
            expect(result).toEqual(mockCharacters);
        });

        it('should handle empty results', async () => {
            // Mock empty response
            pool.query.mockResolvedValue({ rows: [] });

            // Execute function
            const result = await getCharacters();

            // Assertions
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM characters');
            expect(result).toEqual([]);
        });
    });

    /**
     * Tests for createCharacter function
     * Verifies character creation and user association functionality
     * Tests both successful creation and error handling scenarios
     */
    describe('createCharacter', () => {
        it('should create a character and associate it with a user', async () => {
            // Mock character data
            const mockCharacter = {
                name: 'TestNewCharacter',
                role_id: 77,
                class_id: 77,
                ilvl: 777,
                rio: 7777
            };
            const userId = 7777;
            const createdCharacter = { ...mockCharacter, id: 7777 };

            // Mock the two sequential database calls
            pool.query
                .mockResolvedValueOnce({ rows: [createdCharacter] })  // First call: INSERT INTO characters
                .mockResolvedValueOnce({ rows: [] });                 // Second call: INSERT INTO belong_to

            // Execute function
            const result = await createCharacter(mockCharacter, userId);

            // Assertions
            expect(pool.query).toHaveBeenCalledTimes(2);
            expect(pool.query).toHaveBeenNthCalledWith(
                1,
                'INSERT INTO characters (name, role_id, class_id, ilvl, rio) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [mockCharacter.name, mockCharacter.role_id, mockCharacter.class_id, mockCharacter.ilvl, mockCharacter.rio]
            );
            expect(pool.query).toHaveBeenNthCalledWith(
                2,
                'INSERT INTO belong_to (character_id, player_id) VALUES ($1, $2)',
                [createdCharacter.id, userId]
            );
            expect(result).toEqual(createdCharacter);
        });

        it('should handle database errors appropriately', async () => {
            // Mock character data
            const mockCharacter = {
                name: 'TestNewCharacter',
                role_id: 77,
                class_id: 77,
                ilvl: 777,
                rio: 7777
            };
            const userId = 7777;

            // Mock a database error
            pool.query.mockRejectedValue(new Error('Database error'));

            // Execute function and expect it to throw
            await expect(createCharacter(mockCharacter, userId))
                .rejects
                .toThrow('Database error');

            // Verify the first query was attempted
            expect(pool.query).toHaveBeenCalledTimes(1);
        });
    });

    /**
     * Tests for updateCharacter function
     * Verifies character update functionality
     * Tests both successful updates and error handling scenarios
     */
    describe('updateCharacter', () => {
        it('should update a character successfully', async () => {
            // Mock character data
            const mockCharacter = {
                id: 6666,
                name: 'UpdatedCharacterName',
                role_id: 66,
                class_id: 66,
                ilvl: 666,
                rio: 6666
            };

            // Mock the database response
            pool.query.mockResolvedValue({ rows: [mockCharacter] });

            // Execute function
            const result = await updateCharacter(mockCharacter);

            // Assertions
            expect(pool.query).toHaveBeenCalledWith(
                'UPDATE characters SET name = $1 WHERE id = $2 RETURNING *',
                [mockCharacter.name, mockCharacter.id]
            );
            expect(result).toEqual(mockCharacter);
        });

        it('should handle database errors during update', async () => {
            const mockCharacter = {
                id: 6666,
                name: 'UpdatedCharacterName'
            };

            // Mock a database error
            pool.query.mockRejectedValue(new Error('Update failed'));

            // Execute function and expect it to throw
            await expect(updateCharacter(mockCharacter))
                .rejects
                .toThrow('Update failed');

            expect(pool.query).toHaveBeenCalledTimes(1);
        });
    });

    /**
     * Tests for deleteCharacter function
     * Verifies character deletion functionality
     * Tests both successful deletion and error handling scenarios
     */
    describe('deleteCharacter', () => {
        it('should delete a character successfully', async () => {
            // Mock character data
            const mockCharacter = {
                id: 5555,
                name: 'CharacterToDelete',
                role_id: 55,
                class_id: 55,
                ilvl: 555,
                rio: 5555
            };

            // Mock the database response
            pool.query.mockResolvedValue({ rows: [mockCharacter] });

            // Execute function
            const result = await deleteCharacter(mockCharacter);

            // Assertions
            expect(pool.query).toHaveBeenCalledWith(
                'DELETE FROM characters WHERE id = $1 RETURNING *',
                [mockCharacter.id]
            );
            expect(result).toEqual(mockCharacter);
        });

        it('should handle database errors during deletion', async () => {
            const mockCharacter = {
                id: 5555
            };

            // Mock a database error
            pool.query.mockRejectedValue(new Error('Deletion failed'));

            // Execute function and expect it to throw
            await expect(deleteCharacter(mockCharacter))
                .rejects
                .toThrow('Deletion failed');

            expect(pool.query).toHaveBeenCalledTimes(1);
        });
    });
});

