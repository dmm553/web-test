import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { Inventory } from '../models';
import { isEmpty } from 'lodash';

@Controller('inventory')
export class InventoryController {
  @Get('')
  private async get(req: Request, res: Response) {
    try {
      const inventories = await Inventory.findAll();
      if(isEmpty(inventories)) {
        return res.status(404).send('No inventories found');
      }
      return res.status(200).json(inventories);
    } catch(err) {
      console.log(err);
      return res.status(500).send('Unable to retrieve inventories');
    }
  }

  @Get(':id')
  private async getById(req: Request, res: Response) {
    try {
      const inventories = await Inventory.findByPk(req.params.id);
      if(isEmpty(inventories)) {
        return res.status(404).send(`Inventory ${req.params.id} not found`);
      }
      return res.status(200).json(inventories);
    } catch(err) {
      console.log(err);
      return res.status(500).send('Unable to retrieve inventories');
    }
  }

  @Post('')
  private async post(req: Request, res: Response) {
    try {
      const inventory = await Inventory.create(req.body);
      return res.status(200).json(inventory);
    } catch(err) {
      console.log(err);
      return res.status(500).send(`Unable to create inventory: ${err.message}`);
    }
  }
}
