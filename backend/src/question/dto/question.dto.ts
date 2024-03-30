export class QuestionDto {
    readonly id: number;
    readonly question_name: string;
    readonly schema_name: string;
    readonly description: string;
    readonly question_schema: string;
    readonly question_data: string;
    answer_data: string;
    readonly sample_answer: string;
    readonly max_timeout: number;
}
