import { tpccData, tpccSchema } from "db/question_datasets/tpcc";
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTPCC1711598993896 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS tpcc`);
        await queryRunner.query(`ALTER DEFAULT PRIVILEGES FOR ROLE ${process.env.ADMIN_USERNAME} IN SCHEMA tpcc GRANT SELECT ON TABLES TO ${process.env.PARTICIPANT_USERNAME}`);
        const modifiedTables = tpccSchema.replace(/CREATE TABLE (\w+)/g, 'CREATE TABLE IF NOT EXISTS "tpcc"."$1"').replace(/REFERENCES (\w+)/g, 'REFERENCES "tpcc"."$1"');
        await queryRunner.query(modifiedTables); // Execute each query separately

        const modifiedData = tpccData.replace(/INSERT INTO (\w+)/g, 'INSERT INTO "tpcc"."$1"');
        await queryRunner.query(modifiedData);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP SCHEMA tpcc CASCADE`);
    }
}
