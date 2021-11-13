import { Reservation } from '../models';

export class ReservationService {
  getAll = async () => {
    try {
      const reservations = await Reservation.findAll();
      return reservations;
    } catch(err) {
      console.log(err);
      throw new Error('Unable to retrieve reservations');
    }
  }

  getById = async (id:number) => {
    try {
      const reservations = await Reservation.findByPk(id);
      return reservations;
    } catch(err) {
      console.log(err);
      throw new Error('Unable to retrieve reservations');
    }
  }

  createNewReservation = async (reservation:Reservation) => {
    try {
      const newReservation = await Reservation.create(reservation);
      return newReservation;
    } catch(err) {
      console.log(err);
      throw new Error(`Unable to create Reservation: ${err.message}`)
    }
  }
}

export const reservationService = new ReservationService();