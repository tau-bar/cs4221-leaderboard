import { OmitType, PickType } from "@nestjs/mapped-types";
import { SubmissionDto } from "./submission.dto";

export class SubmissionKeyDto extends PickType(SubmissionDto, ['student_id', 'question_id', 'submission_time']) {}