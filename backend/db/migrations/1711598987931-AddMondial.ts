import { mondialData, mondialSchema } from "db/question_datasets/mondial";
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMondial1711598987931 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const modifiedTables = mondialSchema.replace(/CREATE TABLE (\w+)/g, (match, tableName) => `CREATE TABLE IF NOT EXISTS "mondial"."${tableName.toLowerCase()}"`).replace(/REFERENCES (\w+)/g, (match, tableName) => `REFERENCES "mondial"."${tableName.toLowerCase()}"`);
        await queryRunner.query(modifiedTables); // Execute each query separately

        const modifiedData = mondialData.replace(/INSERT INTO (\w+)/g, (match, tableName) => `INSERT INTO "mondial"."${tableName.toLowerCase()}"`);
        await queryRunner.query(modifiedData);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableNames = mondialSchema.match(/CREATE TABLE (\w+)/g).map(match => match.split(/\s+/)[5].toLowerCase());
        const dropTableQueries = tableNames.map(tableName => `DROP TABLE IF EXISTS "${tableName}" CASCADE;`);
        for (const query of dropTableQueries) {
            await queryRunner.query(query);
        }
        queryRunner.query(`DROP TYPE IF EXISTS geocoord;`);
    }
}
