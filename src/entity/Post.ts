import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!:number;

    @Column("varchar")
    @IsNotEmpty({message: 'O título é obrigatório'})
    @IsString({message: "O título deve ser um texto."})
    @MinLength(5, {message:"O título deve ter pelo menos cinco caracteres"})
    title!: string;

    @Column("text")
    @IsNotEmpty({message: 'O conteúdo é obrigatório'})
    @IsString({message: "O conteúdo deve ser um texto."})
    content!: string;

    @ManyToOne(()=> User, (user)=> user.posts, { onDelete: "CASCADE"})
    user!: User;

}