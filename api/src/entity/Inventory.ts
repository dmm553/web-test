/**
 * Inventory
 * 
 * @typedef {object} Entity.Inventory
 * @property {number} restaurant_id
 * @property {number} party_size
 * @property {Date} date_time
 * @property {number} max_reservations
 * @property {number} available_reservations
 */

/**
 * 
 * @param {object} params
 * @param {number} params.restaurant_id
 * @param {number} params.party_size
 * @param {string} params.date_time
 * @param {number} params.max_reservations
 * @returns {Entity.Inventory}
 */
export function Inventory(params) {
  const {
    restaurant_id = null,
    party_size = null,
    date_time = null,
    max_reservations = null,
  } = params;
  return {
    restaurant_id,
    party_size,
    date_time,
    max_reservations,
    available_reservations: max_reservations
  }
}