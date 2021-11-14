import { inventoryService } from '../../src/services/InventoryService';

// jest.mock('../../src/models/Inventory', () => {
//   const mInventory = { findAll: jest.fn() };
//   return { Inventory: jest.fn(() => mInventory) };
// });

describe('Inventory Service', () => {
  it('Returns all inventories', async () => {
    const inventories = await inventoryService.getAll();
    expect(inventories.length).toBe(1);
  })
})