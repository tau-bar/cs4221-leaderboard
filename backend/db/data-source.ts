import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
    name: "admin",
    type: "postgres",
    url: `postgres://${process.env.ADMIN_USERNAME}.apbjycsgbzmzyabmeuob:${process.env.ADMIN_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:${process.env.DATABASE_PORT}/postgres`,
    synchronize: false,
    logging: true,
    entities: ["dist/**/*.entity.js"],
    migrations: ["dist/db/migrations/*.js"]
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;