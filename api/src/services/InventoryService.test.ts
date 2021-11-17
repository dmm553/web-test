import { Sequelize } from 'sequelize-typescript';
import { RouterServer } from '../RouterServer';
import * as models from '../models';
import supertest from 'supertest';
import { inventoryService } from './InventoryService';

describe('Inventory Service', () => {
  let server, request, sequelize, inventory, restaurant;
  
  beforeAll(async () => {
    server = new RouterServer()
    request = supertest(server.app)

    sequelize = new Sequelize(process.env.DATABASE_CONNECTION_STRING, {
      logging: false,
      models: Object.keys(models).map(k => models[k]),
    })

    await sequelize.sync({
      force: true
    })

    restaurant = await models.Restaurant.create({ name: "Test Restaurant", address: "Test" });
    inventory = await models.Inventory.create({
      restaurant_id: restaurant.id,
      party_size: 3,
      date_time: "2021-11-14T11:00-0600",
      max_reservations: 3,
      available_reservations: 3
    });
  });

  afterAll(async () => {
    await models.Inventory.destroy({where: {}, truncate: true});
    await models.Restaurant.destroy({where: {}, truncate: true});
  });

  it('Returns all inventories', async () => {
    const inventories = await inventoryService.getAll();
    expect(inventories.length).toBe(1);
  });

  it('Returns a single inventory', async () => {
    const inventories = await inventoryService.getById(inventory.id);
    expect(inventories.restaurant_id).toBe(1);
    expect(inventories.party_size).toBe(3);
  });

  it('Returns all inventories by restaurant, party size, and date/time', async () => {
    const inventories = await inventoryService.getByRestaurantIDPartySizeDateTime(restaurant.id, 3, "2021-11-14T11:00-0600");
    expect(inventories.restaurant_id).toBe(1);
    expect(inventories.party_size).toBe(3);
  });

  it('Update availability when a reservation is made', async () => {
    const inventories = await inventoryService.updateAvailableInventory(restaurant.id, 3, "2021-11-14T11:00-0600");
    expect(inventories[0][0][0].available_reservations).toBe(2);
  });

  it('Creates new single inventory', async () => {
    const inventories:any = await inventoryService.createNewInventory({
      startDate: "11/12/2021",
      endDate: "11/12/2021",
      startTime: "12:00",
      endTime: "12:00",
      restaurantId: restaurant.id,
      partySize: 4,
      maxReservations: 3
    });
    expect(inventories[0].party_size).toBe(4);
  });

  it('Creates new range of inventories', async () => {
    const inventories:any = await inventoryService.createNewInventory({
      startDate: "11/15/2021",
      endDate: "11/16/2021",
      startTime: "11:00",
      endTime: "15:00",
      restaurantId: restaurant.id,
      partySize: 4,
      maxReservations: 3
    });
    expect(inventories.length).toBe(34);
  });
})