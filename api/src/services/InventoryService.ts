import { Inventory } from '../models';
import { Inventory as InventoryEntity } from '../entity/Inventory'

export class InventoryService {
  getAll = async () => {
    try {
      const inventories = await Inventory.findAll();
      return inventories;
    } catch(err) {
      console.log(err);
      throw new Error('Unable to retrieve inventories');
    }
  }

  getById = async (id:number) => {
    try {
      const inventories = await Inventory.findByPk(id);
      return inventories;
    } catch(err) {
      console.log(err);
      throw new Error('Unable to retrieve inventories');
    }
  }

  createNewInventory = async (inventory:Inventory) => {
    try {
      //TODO: start time/end time
      //TODO: 15 minute increment
      //TODO: change inventory model? remove day? only have times?
      const newInventory = await Inventory.create(InventoryEntity(inventory));
      return newInventory;
    } catch(err) {
      console.log(err);
      throw new Error(`Unable to create inventory: ${err.message}`)
    }
  }
}

export const inventoryService = new InventoryService();