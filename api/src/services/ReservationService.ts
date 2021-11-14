import { Reservation } from '../models';
import { inventoryService } from './InventoryService';
import { Reservation as ReservationEntity } from '../entity/Reservation';
import { ReservationRequest } from '../types/ReservationRequest';
import { isEmpty } from 'lodash';

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

  createNewReservation = async (reservation:ReservationRequest) => {
    try {
      const {
        restaurantId,
        name,
        email,
        partySize,
        dateTime
      } = reservation;

      const inventory = await inventoryService.getByRestaurantIDPartySizeDateTime(restaurantId, partySize, dateTime);
      if(isEmpty(inventory) || inventory.available_reservations <= 0) {
        throw new Error('No reservations available at this time for this party size');
      }

      // create reservation entity and create reservation
      const reservationEntity = ReservationEntity({
        restaurant_id: restaurantId,
        name,
        email,
        party_size: partySize,
        date_time: dateTime,
      });
      const newReservation = await Reservation.create(reservationEntity);

      // update inventory, deduct available
      await inventoryService.updateAvailableInventory(restaurantId, partySize, dateTime);

      return newReservation;
    } catch(err) {
      console.log(err);
      throw new Error(`Unable to create Reservation: ${err.message}`)
    }
  }
}

export const reservationService = new ReservationService();