import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { inventoryService } from '../services/InventoryService';
import { isEmpty } from 'lodash';

@Controller('inventory')
export class InventoryController {
  @Get('')
  private async get(req: Request, res: Response) {
    try {
      const inventories = await inventoryService.getAll();
      if(isEmpty(inventories)) {
        return res.status(404).send('No inventories found');
      }
      return res.status(200).json(inventories);
    } catch(err) {
      return res.status(500).send(err.message);
    }
  }

  @Get(':id')
  private async getById(req: Request, res: Response) {
    try {
      const { id } = req.params as unknown as { id: number };
      if(isNaN(id)) throw new Error(`Invalid id ${id}`);
      const inventories = await inventoryService.getById(id);
      if(isEmpty(inventories)) {
        return res.status(404).send(`Inventory ${id} not found`);
      }
      return res.status(200).json(inventories);
    } catch(err) {
      return res.status(500).send(err.message);
    }
  }

  @Post('')
  private async post(req: Request, res: Response) {
    try {
      const inventory = await inventoryService.createNewInventory(req.body);
      return res.status(200).json(inventory);
    } catch(err) {
      return res.status(500).send(err.message);
    }
  }
}
