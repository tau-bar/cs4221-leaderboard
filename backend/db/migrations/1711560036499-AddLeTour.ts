import { leTourData, leTourSchema } from "db/question_datasets/letour";
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLeTour1711560036499 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const modifiedTables = leTourSchema.replace(/CREATE TABLE IF NOT EXISTS (\w+)/g, 'CREATE TABLE IF NOT EXISTS "letour"."$1"').replace(/REFERENCES (\w+)/g, 'REFERENCES "letour"."$1"');
        await queryRunner.query(modifiedTables); // Execute each query separately

        const modifiedData = leTourData.replace(/INSERT INTO (\w+)/g, 'INSERT INTO "letour"."$1"');
        await queryRunner.query(modifiedData);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableNames = leTourSchema.match(/CREATE TABLE IF NOT EXISTS (\w+)/g).map(match => match.split(/\s+/)[5]);
        const dropTableQueries = tableNames.map(tableName => `DROP TABLE IF EXISTS "letour"."${tableName}" CASCADE;`);
        for (const query of dropTableQueries) {
            await queryRunner.query(query);
        }
    }
}
