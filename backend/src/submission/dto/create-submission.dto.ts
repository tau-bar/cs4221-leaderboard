export class CreateSubmissionDto {
    readonly student_id: number;
    readonly question_id: number;
    readonly submission_time: Date;
    readonly is_correct: boolean;
    readonly planning_time: number;
    readonly execution_time: number;
    readonly query: string;
    readonly status: string;

    constructor(
        student_id: number, 
        question_id: number, 
        is_correct: boolean, 
        planning_time: number, 
        execution_time: number, 
        query: string, 
        status: string,
        submission_time: Date // optional parameter
    ) {
        this.student_id = student_id;
        this.question_id = question_id;
        this.is_correct = is_correct;
        this.planning_time = planning_time;
        this.execution_time = execution_time;
        this.query = query;
        this.status = status;
        if (submission_time != undefined) {
            this.submission_time = submission_time;
        }
    }
}
