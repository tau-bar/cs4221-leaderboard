export class CreateQuestionDto {
    readonly id: number;
    readonly description: string;
    readonly question_schema: string;
    readonly question_data: string;
    readonly answer_data: string;
    readonly max_timeout: number;

    constructor(id: number, description: string, question_schema: string, question_data: string, answer_data: string, max_timeout: number) {
        this.id = id;
        this.description = description;
        this.question_schema = question_schema;
        this.question_data = question_data;
        this.answer_data = answer_data;
        this.max_timeout = max_timeout;
    }
}
