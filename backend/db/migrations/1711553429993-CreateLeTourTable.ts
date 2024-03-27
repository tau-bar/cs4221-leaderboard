// import { leTourData, leTourSchema } from "db/question_datasets/letour";
// import { MigrationInterface, QueryRunner } from "typeorm";

// export class CreateLeTourTable1711553429993 implements MigrationInterface {
//     name = 'CreateLeTourTable1711553429993'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         queryRunner.query(`CREATE SCHEMA letour`);
//         queryRunner.query(`CREATE SCHEMA mondial`);
//         queryRunner.query(`CREATE SCHEMA tpcc`);
//         queryRunner.query(`CREATE SCHEMA carprices`);
//         // const modifiedTables = leTourSchema.replace(/CREATE TABLE IF NOT EXISTS (\w+)/g, 'CREATE TABLE \"admin\".\"$1\"');
//         // await queryRunner.query(modifiedTables);
//         // const insertQueries = leTourData.replace(/INSERT INTO (\w+)/g, 'INSERT INTO "questions\".\"$1\"')
//         // await queryRunner.query(insertQueries);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         queryRunner.query(`DROP SCHEMA letour`);
//         queryRunner.query(`DROP SCHEMA mondial`);
//         queryRunner.query(`DROP SCHEMA tpcc`);
//         queryRunner.query(`DROP SCHEMA carprices`);
//         // const tableNames = leTourSchema.match(/CREATE TABLE IF NOT EXISTS (\w+)/g).map(match => match.split(/\s+/)[5]);
//         // const dropTableQueries = tableNames.map(tableName => `DROP TABLE IF EXISTS "admin"."${tableName}";`);
//         // for (const query of dropTableQueries) {
//         //     await queryRunner.query(query);
//         // }
//     }
// }
