import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSchemas1711559987598 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`CREATE SCHEMA IF NOT EXISTS letour`);
        queryRunner.query(`CREATE SCHEMA IF NOT EXISTS mondial`);
        queryRunner.query(`CREATE SCHEMA IF NOT EXISTS tpcc`);
        queryRunner.query(`CREATE SCHEMA IF NOT EXISTS carprices`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`DROP SCHEMA letour`);
        queryRunner.query(`DROP SCHEMA mondial`);
        queryRunner.query(`DROP SCHEMA tpcc`);
        queryRunner.query(`DROP SCHEMA carprices`);
    }

}
