import { Restaurant } from '../models';

export const getAll = async () => {
  try {
    const restaurants = await Restaurant.findAll();
    return restaurants;
  } catch(err) {
    console.log(err);
    throw new Error('Unable to retrieve restaurants');
  }
}

export const getById = async (id:number) => {
  try {
    const restaurants = await Restaurant.findByPk(id);
    return restaurants;
  } catch(err) {
    console.log(err);
    throw new Error('Unable to retrieve restaurants');
  }
}

export const createNewRestaurant = async (restaurant:object) => {
  try {
    const newRestaurant = await Restaurant.create(restaurant);
    return newRestaurant;
  } catch(err) {
    console.log(err);
    throw new Error(`Unable to create restaurant: ${err.message}`)
  }
}