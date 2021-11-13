import { Reservation } from '../models';

export const getAll = async () => {
  try {
    const reservations = await Reservation.findAll();
    return reservations;
  } catch(err) {
    console.log(err);
    throw new Error('Unable to retrieve reservations');
  }
}

export const getById = async (id:number) => {
  try {
    const reservations = await Reservation.findByPk(id);
    return reservations;
  } catch(err) {
    console.log(err);
    throw new Error('Unable to retrieve reservations');
  }
}

export const createNewReservation = async (reservation:Reservation) => {
  try {
    const newReservation = await Reservation.create(reservation);
    return newReservation;
  } catch(err) {
    console.log(err);
    throw new Error(`Unable to create Reservation: ${err.message}`)
  }
}