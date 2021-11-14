export type InventoryRequest = {
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  restaurantId: number,
  partySize: number,
  maxReservations: number,
};