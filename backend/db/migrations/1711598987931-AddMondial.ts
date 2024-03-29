import { mondialData, mondialSchema } from "db/question_datasets/mondial";
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMondial1711598987931 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS mondial`);
        await queryRunner.query(`GRANT USAGE ON SCHEMA mondial TO ${process.env.PARTICIPANT_USERNAME};`)
        await queryRunner.query(`ALTER DEFAULT PRIVILEGES FOR ROLE ${process.env.ADMIN_USERNAME} IN SCHEMA mondial GRANT SELECT ON TABLES TO ${process.env.PARTICIPANT_USERNAME}`);
        const modifiedTables = mondialSchema.replace(/CREATE TABLE (\w+)/g, (match, tableName) => `CREATE TABLE IF NOT EXISTS "mondial"."${tableName.toLowerCase()}"`).replace(/REFERENCES (\w+)/g, (match, tableName) => `REFERENCES "mondial"."${tableName.toLowerCase()}"`);
        await queryRunner.query(modifiedTables); // Execute each query separately

        const modifiedData = mondialData.replace(/INSERT INTO (\w+)/g, (match, tableName) => `INSERT INTO "mondial"."${tableName.toLowerCase()}"`);
        await queryRunner.query(modifiedData);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP SCHEMA mondial CASCADE`);
        queryRunner.query(`DROP TYPE IF EXISTS geocoord;`);
    }
}
