import { Sequelize } from 'sequelize-typescript';
import { RouterServer } from '../RouterServer';
import * as models from '../models';
import supertest from 'supertest';

describe('Inventory Controller', () => {
  let server, request, sequelize;
  
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

    const restaurant = await models.Restaurant.create({ name: "Test Restaurant", address: "Test" });
    await models.Inventory.upsert({
      restaurant_id: restaurant.id,
      party_size: 3,
      date_time: "2021-11-14T11:00-0600",
      max_reservations: 3,
      available_reservations: 3
    });

  });

  afterAll(async done => {
    await models.Inventory.destroy({ where: { date_time: "2021-11-14T11:00-0600" } });
    await models.Restaurant.destroy({ where: { name: "Test Restaurant", address: "Test" } });
    done();
  });

  it('gets all inventory', async done => {
    const result:any = await request.get('/inventory');
    expect(result.status).toBe(200);
    expect(result.body.length).toBe(1);
    done();
  });

  it('handles no inventory', async done => {
    await models.Inventory.destroy({ where: { date_time: "2021-11-14T11:00-0600" } });
    const result:any = await request.get('/inventory');
    expect(result.status).toBe(404);
    expect(result.text).toBe('No inventories found');
    done();
  });
});