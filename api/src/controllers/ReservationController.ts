import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { getAll, getById, createNewReservation } from '../services/ReservationService';
import { isEmpty } from 'lodash';

@Controller('reservation')
export class ReservationController {
  @Get('')
  private async get(req: Request, res: Response) {
    try {
      const reservations = await getAll();
      if(isEmpty(reservations)) {
        return res.status(404).send('No reservations found');
      }
      return res.status(200).json(reservations);
    } catch(err) {
      return res.status(500).send('Unable to retrieve reservations');
    }
  }

  @Get(':id')
  private async getById(req: Request, res: Response) {
    try {
      const { id } = req.params as unknown as { id: number };
      const reservations = await getById(id);
      if(isEmpty(reservations)) {
        return res.status(404).send(`Reservation ${id} not found`);
      }
      return res.status(200).json(reservations);
    } catch(err) {
      return res.status(500).send('Unable to retrieve reservations');
    }
  }

  @Post('')
  private async post(req: Request, res: Response) {
    try {
      const reservation = await createNewReservation(req.body);
      return res.status(200).json(reservation);
    } catch(err) {
      return res.status(500).send(`Unable to create reservation: ${err.message}`);
    }
  }
}
