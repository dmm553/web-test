import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { Restaurant } from '../models';
import { isEmpty } from 'lodash';

@Controller('restaurant')
export class RestaurantController {
  @Get('')
  private async get(req: Request, res: Response) {
    try {
      const restaurants = await Restaurant.findAll();
      if(isEmpty(restaurants)) {
        return res.status(404).send('No restaurants found');
      }
      return res.status(200).json(restaurants);
    } catch(err) {
      console.log(err);
      return res.status(500).send('Unable to retrieve restaurants');
    }
  }

  @Get(':id')
  private async getById(req: Request, res: Response) {
    try {
      const restaurants = await Restaurant.findByPk(req.params.id);
      if(isEmpty(restaurants)) {
        return res.status(404).send(`Restaurant ${req.params.id} not found`);
      }
      return res.status(200).json(restaurants);
    } catch(err) {
      console.log(err);
      return res.status(500).send('Unable to retrieve restaurants');
    }
  }

  @Post('')
  private async post(req: Request, res: Response) {
    try {
      const restaurant = await Restaurant.create(req.body);
      return res.status(200).json(restaurant);
    } catch(err) {
      console.log(err);
      return res.status(500).send(`Unable to create restaurant: ${err.message}`);
    }
  }
}
