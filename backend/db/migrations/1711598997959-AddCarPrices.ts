import { carpricesData, carpricesSchema } from "db/question_datasets/carprices";
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCarPrices1711598997959 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("SET LOCAL SEARCH_PATH=carprices");
        await queryRunner.query(carpricesSchema);
        await queryRunner.query(carpricesData);
        await queryRunner.query("SET LOCAL SEARCH_PATH=public");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableNames = carpricesSchema.match(/CREATE TABLE (\w+)/g).map(match => match.split(/\s+/)[5]);
        const dropTableQueries = tableNames.map(tableName => `DROP TABLE IF EXISTS "carprices"."${tableName}" CASCADE;`);
        for (const query of dropTableQueries) {
            await queryRunner.query(query);
        }
    }
}
