import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { IsNotEmpty, IsString, MinLength, Validate } from "class-validator";
import { NoBlankSpaceConstraint } from "../decorators/noBlankSpace";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!:number;

    @Column("varchar")
    @IsNotEmpty({message: 'O título é obrigatório'})
    @IsString({message: "O título deve ser um texto."})
    @MinLength(5, {message:"O título deve ter pelo menos cinco caracteres"})
    @Validate(NoBlankSpaceConstraint, {message: 'O título do post precsa ter lgum texto'})
    title!: string;

    @Column("text")
    @IsNotEmpty({message: 'O conteúdo é obrigatório'})
    @IsString({message: "O conteúdo deve ser um texto."})
    @Validate(NoBlankSpaceConstraint)
    content!: string;

    @ManyToOne(()=> User, (user)=> user.posts, { onDelete: "CASCADE"})
    user!: User;

}