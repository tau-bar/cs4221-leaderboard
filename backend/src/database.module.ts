import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { dataSourceOptions } from 'db/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forRoot({
      name: "participant",
      type: "postgres",
      url: `postgres://${process.env.PARTICIPANT_USERNAME}.apbjycsgbzmzyabmeuob:${process.env.PARTICIPANT_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:${process.env.DATABASE_PORT}/postgres`,
      synchronize: false,
      entities: [],
      logging: true
    }),
  ]
})
export class DatabaseModule { }