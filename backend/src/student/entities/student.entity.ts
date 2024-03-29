import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: "admin", name: "student" })
export class Student {
    @PrimaryColumn({ type: "text" })
    id: string;

    @Column("text", { nullable: false })
    name: string;

    @Column("text", { nullable: false, unique: true })
    email: string;
}
