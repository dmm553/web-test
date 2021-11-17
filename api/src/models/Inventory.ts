import {
    AllowNull,
    BelongsTo,
    Column,
    CreatedAt,
    createIndexDecorator,
    DeletedAt,
    ForeignKey,
    HasMany,
    Is,
    Model,
    NotNull,
    PrimaryKey, Table,
    UpdatedAt,
  } from 'sequelize-typescript'
  import { Restaurant } from '.'

  const InventoryIndex = createIndexDecorator({
    name: 'inventory-index',
    parser: 'my-parser',
    type: 'UNIQUE',
    unique: true,
    using: 'BTREE',
  })
  
  @Table({ tableName: 'inventory' })
  export class Inventory extends Model<Inventory> {
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
    @InventoryIndex
    @Column
    party_size: number
  
    @NotNull
    @AllowNull(false)
    @InventoryIndex
    @Column
    date_time: Date

    @NotNull
    @AllowNull(false)
    @Column
    max_reservations: number

    @NotNull
    @AllowNull(false)
    @Is(function betweenZeroAndMax(value: number) {
        if(value < 0 || value > this.max_reservations.value) {
            throw new Error(`Invalid number of available reservations for this time: ${value}. Should be between 0 and ${this.max_reservations.value}.`);
        }
    })
    @Column
    available_reservations: number
  
    @DeletedAt
    deleted_at: string
  
    @CreatedAt
    created_at: string
  
    @UpdatedAt
    updated_at: string
  }
  