export class QuestionDto {
    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly question_schema: string;
    readonly question_data: string;
    readonly answer_data: any[];
    readonly max_timeout: number;
}
