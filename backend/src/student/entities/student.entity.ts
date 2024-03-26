import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: "admin", name: "student" })
export class Student {
    @PrimaryGeneratedColumn({ type: "int8" })
    id: number;

    @Column("text", { nullable: false })
    name: string;

    @Column("text", { nullable: false, unique: true })
    email: string;
}
