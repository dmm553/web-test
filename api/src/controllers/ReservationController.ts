import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { Reservation } from '../models';
import { isEmpty } from 'lodash';

@Controller('reservation')
export class ReservationController {
  @Get('')
  private async get(req: Request, res: Response) {
    try {
      const reservations = await Reservation.findAll();
      if(isEmpty(reservations)) {
        return res.status(404).send('No reservations found');
      }
      return res.status(200).json(reservations);
    } catch(err) {
      console.log(err);
      return res.status(500).send('Unable to retrieve reservations');
    }
  }

  @Get(':id')
  private async getById(req: Request, res: Response) {
    try {
      const reservations = await Reservation.findByPk(req.params.id);
      if(isEmpty(reservations)) {
        return res.status(404).send(`Reservation ${req.params.id} not found`);
      }
      return res.status(200).json(reservations);
    } catch(err) {
      console.log(err);
      return res.status(500).send('Unable to retrieve reservations');
    }
  }

  @Post('')
  private async post(req: Request, res: Response) {
    try {
      const reservation = await Reservation.create(req.body);
      return res.status(200).json(reservation);
    } catch(err) {
      console.log(err);
      return res.status(500).send(`Unable to create reservation: ${err.message}`);
    }
  }
}
