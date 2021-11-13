import { Inventory } from '../models';

export const getAll = async () => {
  try {
    const inventories = await Inventory.findAll();
    return inventories;
  } catch(err) {
    console.log(err);
    throw new Error('Unable to retrieve inventories');
  }
}

export const getById = async (id:number) => {
  try {
    const inventories = await Inventory.findByPk(id);
    return inventories;
  } catch(err) {
    console.log(err);
    throw new Error('Unable to retrieve inventories');
  }
}

export const createNewInventory = async (inventory:Inventory) => {
  try {
    const newInventory = await Inventory.create(inventory);
    return newInventory;
  } catch(err) {
    console.log(err);
    throw new Error(`Unable to create inventory: ${err.message}`)
  }
}