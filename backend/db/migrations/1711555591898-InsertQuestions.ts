import loadQuestions from "db/question_datasets/questions";
import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertQuestions1711555591898 implements MigrationInterface {
    name = 'InsertQuestions1711555591898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        for (const question of await loadQuestions()) {
            await queryRunner.query(`
                INSERT INTO "admin"."question" (id, question_name, schema_name, description, question_schema, question_data, answer_data, max_timeout)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [
                question.id,
                question.question_name,
                question.schema_name,
                question.description,
                question.question_schema,
                question.question_data,
                JSON.stringify(question.answer_data),
                question.max_timeout
            ]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        for (const question of await loadQuestions()) {
            await queryRunner.query(`
                DELETE FROM "admin"."question" WHERE id = $1
            `, [question.id]);
        }
    }
}
