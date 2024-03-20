export class UpdateStudentDto {
    readonly id: number;
    readonly name: string;
    readonly email: string;

    constructor(id: number, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
