import { OmitType } from "@nestjs/mapped-types";
import { SubmissionDto } from "./submission.dto";

export class CreateSubmissionDto extends OmitType(SubmissionDto, ['submission_time']) {}
