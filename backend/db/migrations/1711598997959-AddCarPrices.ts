import { carpricesData, carpricesSchema } from "db/question_datasets/carprices";
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCarPrices1711598997959 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS carprices`);
        await queryRunner.query(`GRANT USAGE ON SCHEMA carprices TO ${process.env.PARTICIPANT_USERNAME};`)
        await queryRunner.query(`ALTER DEFAULT PRIVILEGES FOR ROLE ${process.env.ADMIN_USERNAME} IN SCHEMA carprices GRANT SELECT ON TABLES TO ${process.env.PARTICIPANT_USERNAME}`);
        await queryRunner.query("SET LOCAL SEARCH_PATH=carprices");
        await queryRunner.query(carpricesSchema);
        await queryRunner.query(carpricesData);
        await queryRunner.query("SET LOCAL SEARCH_PATH=public");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP SCHEMA carprices CASCADE`);
    }
}
