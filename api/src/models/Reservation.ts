import {
    AllowNull,
    BeforeCreate,
    BelongsTo,
    Column,
    CreatedAt,
    createIndexDecorator,
    DeletedAt,
    ForeignKey,
    IsDate,
    IsEmail,
    Model,
    NotNull,
    PrimaryKey, Table,
    UpdatedAt
  } from 'sequelize-typescript'
import { Restaurant } from '.'

  const ReservationIndex = createIndexDecorator({
    name: 'reservation-index',
    parser: 'my-parser',
    type: 'UNIQUE',
    unique: true,
    using: 'BTREE',
  })
  
  @Table({ tableName: 'reservation' })
  export class Reservation extends Model<Reservation> {
    @PrimaryKey
    @Column({ autoIncrement: true })
    id: number

    @ForeignKey(() => Restaurant)
    @NotNull
    @AllowNull(false)
    @Column
    restaurant_id: number

    @BelongsTo(() => Restaurant, 'restaurant_id')
    restaurant: Restaurant
  
    @NotNull
    @AllowNull(false)
    @ReservationIndex
    @Column
    name: string
  
    @NotNull
    @AllowNull(false)
    @IsEmail
    @ReservationIndex
    @Column
    email: string
  
    @NotNull
    @AllowNull(false)
    @ReservationIndex
    @Column
    party_size: number
  
    @NotNull
    @AllowNull(false)
    @IsDate
    @ReservationIndex
    @Column
    date_time: Date
  
    @DeletedAt
    deleted_at: string
  
    @CreatedAt
    created_at: string
  
    @UpdatedAt
    updated_at: string
  }
  