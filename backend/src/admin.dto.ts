export class SubmitDto {
    readonly student_id: number;
    readonly question_id: number;
    readonly submission_time: Date;
    readonly query: string;
    readonly status: string;
}