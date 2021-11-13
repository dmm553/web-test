import {
  Column,
  CreatedAt,
  createIndexDecorator,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey, Table,
  UpdatedAt
} from 'sequelize-typescript'
import { Inventory, Reservation } from '.'

const RestaurantIndex = createIndexDecorator({
  name: 'restaurant-index',
  parser: 'my-parser',
  type: 'UNIQUE',
  unique: true,
  using: 'BTREE',
})

@Table({ tableName: 'restaurants' })
export class Restaurant extends Model<Restaurant> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @RestaurantIndex
  @Column
  name: string

  @RestaurantIndex
  @Column
  address: string

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string

  @HasMany(() => Inventory)
  inventories: Inventory[]

  @HasMany(() => Reservation)
  reservations: Reservation[]
}
