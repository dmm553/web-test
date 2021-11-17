import { Sequelize } from 'sequelize-typescript';
import { RouterServer } from '../RouterServer';
import * as models from '../models';
import supertest from 'supertest';

describe('Inventory Controller', () => {
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

  it('gets all inventory', async () => {
    const result:any = await request.get('/inventory');
    expect(result.status).toBe(200);
    expect(result.body.length).toBe(1);
  });

  it('gets inventory by id', async () => {
    const result:any = await request.get(`/inventory/${inventory.id}`);
    expect(result.status).toBe(200);
    expect(result.body.party_size).toBe(3);
    expect(result.body.max_reservations).toBe(3);
    expect(result.body.available_reservations).toBe(3);
  });

  it('handles non-existant inventory id', async () => {
    const result:any = await request.get('/inventory/999999999');
    expect(result.status).toBe(404);
    expect(result.text).toBe('Inventory 999999999 not found');
  });

  it('handles invalid inventory id', async () => {
    const result:any = await request.get('/inventory/a');
    expect(result.status).toBe(500);
    expect(result.text).toBe('Invalid id a');
  });

  it('handles no inventory', async () => {
    await models.Inventory.destroy({ where: { date_time: "2021-11-14T11:00-0600" } });
    const result:any = await request.get('/inventory');
    expect(result.status).toBe(404);
    expect(result.text).toBe('No inventories found');
  });

  it('creates a single inventory entry', async () => {
    const result:any = await request.post('/inventory').send({
      startDate: "11/14/2021",
      endDate: "11/14/2021",
      startTime: "12:00",
      endTime: "12:00",
      restaurantId: restaurant.id,
      partySize: 4,
      maxReservations: 3
    }); 
    expect(result.status).toBe(200);
    expect(result.body.length).toBe(1);
    expect(result.body[0].party_size).toBe(4);
    expect(result.body[0].max_reservations).toBe(3);
    expect(result.body[0].available_reservations).toBe(3);
  });

  it('handles a duplicate inventory entry', async () => {
    const result:any = await request.post('/inventory').send({
      startDate: "11/14/2021",
      endDate: "11/14/2021",
      startTime: "12:00",
      endTime: "12:00",
      restaurantId: restaurant.id,
      partySize: 4,
      maxReservations: 3
    });
    expect(result.status).toBe(500);
    expect(result.text).toBe('Unable to create inventory: Validation error');
  });

  it('creates a range of inventory entries in 15 minute increments', async () => {
    const result:any = await request.post('/inventory').send({
      startDate: "11/15/2021",
      endDate: "11/16/2021",
      startTime: "11:00",
      endTime: "15:00",
      restaurantId: restaurant.id,
      partySize: 4,
      maxReservations: 3
    });
    expect(result.status).toBe(200);
    expect(result.body.length).toBe(34);
    expect(result.body[0].party_size).toBe(4);
    expect(result.body[0].max_reservations).toBe(3);
    expect(result.body[0].available_reservations).toBe(3);
  });
});