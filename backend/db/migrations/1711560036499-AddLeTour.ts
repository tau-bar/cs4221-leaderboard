// import { leTourData, leTourSchema } from "db/question_datasets/letour";
// import { MigrationInterface, QueryRunner } from "typeorm";

// export class AddLeTour1711560036499 implements MigrationInterface {
//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS letour`);
//         await queryRunner.query(`GRANT USAGE ON SCHEMA letour TO ${process.env.PARTICIPANT_USERNAME};`)
//         await queryRunner.query(`ALTER DEFAULT PRIVILEGES FOR ROLE ${process.env.ADMIN_USERNAME} IN SCHEMA letour GRANT SELECT ON TABLES TO ${process.env.PARTICIPANT_USERNAME}`);
//         const modifiedTables = leTourSchema.replace(/CREATE TABLE IF NOT EXISTS (\w+)/g, 'CREATE TABLE IF NOT EXISTS "letour"."$1"').replace(/REFERENCES (\w+)/g, 'REFERENCES "letour"."$1"');
//         await queryRunner.query(modifiedTables); // Execute each query separately

//         const modifiedData = leTourData.replace(/INSERT INTO (\w+)/g, 'INSERT INTO "letour"."$1"');
//         await queryRunner.query(modifiedData);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`DROP SCHEMA letour CASCADE`);
//     }
// }
