import { PartialType } from "@nestjs/mapped-types";
import { SubmissionDto } from "./submission.dto";

export class UpdateSubmissionDto extends PartialType(SubmissionDto) {}
