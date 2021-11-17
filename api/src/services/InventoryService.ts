import {
  add,
  eachDayOfInterval,
  eachMinuteOfInterval,
  isEqual } from 'date-fns';
import { Inventory } from '../models';
import { Inventory as InventoryEntity } from '../entity/Inventory';
import { InventoryRequest } from '../types/InventoryRequest';

const RESERVATION_INCREMENT = 15;

export class InventoryService {
  getAll = async () => {
    try {
      const inventories = await Inventory.findAll();
      return inventories;
    } catch(err) {
      throw new Error('Unable to retrieve inventories');
    }
  };

  getById = async (id:number) => {
    try {
      const inventories = await Inventory.findByPk(id);
      return inventories;
    } catch(err) {
      throw new Error('Unable to retrieve inventories');
    }
  };

  getByRestaurantIDPartySizeDateTime = async (restaurantId:number, partySize:number, dateTime:string) => {
    try {
      const inventory = await Inventory.findOne({ where: { restaurant_id: restaurantId, party_size: partySize, date_time: dateTime } });
      return inventory;
    } catch(err) {
      throw new Error('Unable to retrieve inventories');
    }
  }

  updateAvailableInventory = async (restaurantId:number, partySize:number, dateTime:string) => {
    try {
      const inventory = await Inventory.increment('available_reservations', { by: -1, where: { restaurant_id: restaurantId, party_size: partySize, date_time: dateTime } });
      return inventory;
    } catch(err) {
      throw new Error('Unable to update inventory');
    }
  }

  createNewInventory = async (inventoryRequest:InventoryRequest) => {
    try {
      const {
        startDate,
        endDate,
        startTime,
        endTime,
        restaurantId,
        partySize,
        maxReservations
      } = inventoryRequest;

      const startDates = startDate.split('/');
      const startYear = parseInt(startDates[2]);
      const startMonth = parseInt(startDates[0])-1;
      const startDay = parseInt(startDates[1]);

      const endDates = endDate.split('/');
      const endYear = parseInt(endDates[2]);
      const endMonth = parseInt(endDates[0])-1; 
      const endDay = parseInt(endDates[1]);

      const startTimes = startTime.split(':');
      const startHour = parseInt(startTimes[0]);
      const startMinute = parseInt(startTimes[1]);

      const endTimes = endTime.split(':');
      const endHour = parseInt(endTimes[0]);
      const endMinute = parseInt(endTimes[1]);

      const startDateObject = new Date(startYear, startMonth, startDay);
      const endDateObject = new Date(endYear, endMonth, endDay);

      const dayInterval = eachDayOfInterval({
        start: startDateObject,
        end: endDateObject
      });

      const inventoryResult = [];

      for(const date of dayInterval) {
        const startDateTime = add(new Date(date), { 
          hours: startHour, minutes: startMinute
        });

        const endDateTime = add(new Date(date), { 
          hours: endHour, minutes: endMinute 
        });

        let minuteInterval;
        
        if(isEqual(startDateTime, endDateTime)) {
          minuteInterval = [startDateTime];
        } else {
          minuteInterval = eachMinuteOfInterval({
            start: startDateTime, 
            end: endDateTime
          }, 
          {
            step: RESERVATION_INCREMENT
          });
        }
        
        for(const dateTime of minuteInterval) {
          const inventoryEntity = InventoryEntity({
            restaurant_id: restaurantId,
            party_size: partySize,
            date_time: dateTime,
            max_reservations: maxReservations
          })
          
          const newInventory = await Inventory.create(inventoryEntity);
          inventoryResult.push(newInventory);
        }
      }

      return inventoryResult;
    } catch(err) {
      throw new Error(`Unable to create inventory: ${err.message}`)
    }
  }
}

export const inventoryService = new InventoryService();