import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { getAll, getById, createNewRestaurant } from '../services/RestaurantService';
import { isEmpty } from 'lodash';

@Controller('restaurant')
export class RestaurantController {
  @Get('')
  private async get(req: Request, res: Response) {
    try {
      const restaurants = await getAll();
      if(isEmpty(restaurants)) {
        return res.status(404).send('No restaurants found');
      }
      return res.status(200).json(restaurants);
    } catch(err) {
      return res.status(500).send(err.message);
    }
  }

  @Get(':id')
  private async getById(req: Request, res: Response) {
    try {
      const { id } = req.params as unknown as { id: number };
      const restaurants = await getById(id);
      if(isEmpty(restaurants)) {
        return res.status(404).send(`Restaurant ${id} not found`);
      }
      return res.status(200).json(restaurants);
    } catch(err) {
      return res.status(500).send(err.message);
    }
  }

  @Post('')
  private async post(req: Request, res: Response) {
    try {
      const restaurant = await createNewRestaurant(req.body);
      return res.status(200).json(restaurant);
    } catch(err) {
      return res.status(500).send(err.message);
    }
  }
}
