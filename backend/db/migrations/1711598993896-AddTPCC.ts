import { tpccData, tpccSchema } from "db/question_datasets/tpcc";
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTPCC1711598993896 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const modifiedTables = tpccSchema.replace(/CREATE TABLE (\w+)/g, 'CREATE TABLE IF NOT EXISTS "tpcc"."$1"').replace(/REFERENCES (\w+)/g, 'REFERENCES "tpcc"."$1"');
        await queryRunner.query(modifiedTables); // Execute each query separately

        const modifiedData = tpccData.replace(/INSERT INTO (\w+)/g, 'INSERT INTO "tpcc"."$1"');
        await queryRunner.query(modifiedData);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableNames = tpccSchema.match(/CREATE TABLE (\w+)/g).map(match => match.split(/\s+/)[5]);
        const dropTableQueries = tableNames.map(tableName => `DROP TABLE IF EXISTS "tpcc"."${tableName}" CASCADE;`);
        for (const query of dropTableQueries) {
            await queryRunner.query(query);
        }
    }
}
