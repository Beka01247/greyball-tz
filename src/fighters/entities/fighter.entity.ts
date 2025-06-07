import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('fighters')
export class Fighter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 60 })
  firstName: string;

  @Column({ length: 60 })
  lastName: string;

  @Column({ length: 60, nullable: true })
  nickname?: string;

  @Column({ type: 'date', nullable: true })
  birthDate?: string;

  @Column({ length: 60, nullable: true })
  country?: string;

  @Column({ type: 'int', nullable: true })
  heightCm?: number;

  @Column({ type: 'int', nullable: true })
  reachCm?: number;

  @Column({ length: 30 })
  weightClass: string;

  @Column({ default: false })
  isRetired: boolean;

  @Column({ type: 'int', default: 0 })
  wins: number;

  @Column({ type: 'int', default: 0 })
  losses: number;

  @Column({ type: 'int', default: 0 })
  draws: number;

  @Column({ type: 'int', default: 0 })
  knockouts: number;

  @Column({ type: 'int', default: 0 })
  submissions: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
