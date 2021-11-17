import { Sequelize } from 'sequelize-typescript';
import { RouterServer } from '../RouterServer';
import * as models from '../models';
import supertest from 'supertest';
import { reservationService } from './ReservationService';
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

  it('creates a new reservation', async () => {
    const initialInventory = await inventoryService.getById(inventory.id);
    const reservation = await reservationService.createNewReservation({
      restaurantId: restaurant.id,
      name: "Test",
      email: "no@email.com",
      partySize: 3,
      dateTime: "2021-11-14T11:00-0600"
    });
    const availableInventory = await inventoryService.getById(inventory.id);
    expect(reservation.id).toBe(1);
    expect(initialInventory.available_reservations).toBe(3);
    expect(availableInventory.available_reservations).toBe(2);
  });

  it('handles a reservation wih unavailable inventory', async () => {
    try {
      const reservation = await reservationService.createNewReservation({
        restaurantId: restaurant.id,
        name: "Test",
        email: "no@email.com",
        partySize: 9,
        dateTime: "2021-11-14T11:00-0600"
      });
    } catch (err) {
      expect(err.message).toBe('Unable to create Reservation: No reservations available at this time for this party size');
    }
  });
})