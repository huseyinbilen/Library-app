import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column({
        type: 'jsonb',
        default: { past: [], present: [] },
      })
    books!: { past: number[]; present: number[] }
}