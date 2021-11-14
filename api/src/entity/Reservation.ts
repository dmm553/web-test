/**
 * Reservation
 * 
 * @typedef {object} Entity.Reservation
 * @property {number} restaurant_id
 * @property {string} name
 * @property {string} email
 * @property {number} party_size
 * @property {Date} date_time
 */

/**
 * 
 * @param {object} params
 * @param {number} params.restaurant_id
 * @param {string} params.name
 * @param {string} params.email
 * @param {number} params.party_size
 * @param {string} params.date_time
 * @returns {Entity.Reservation}
 */
 export function Reservation(params) {
  const {
    restaurant_id = null,
    name = null,
    email = null,
    party_size = null,
    date_time = null,
  } = params;
  return {
    restaurant_id,
    name,
    email,
    party_size,
    date_time
  }
}