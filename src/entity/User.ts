import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post";
import { IsNotEmpty, IsString, IsEmail} from "class-validator";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!:number;

    @Column('varchar')
    @IsNotEmpty({message: 'O primeiro nome é obrigatório'})
    @IsString({message: "O nome deve ser um texto."})
    firstName!:string;

    @Column('varchar')
    @IsNotEmpty({message: 'O sobrenome é obrigatório'})
    @IsString({message: "O sobrenome deve ser um texto."})
    lastName!:string;

    @Column({type:"boolean", default: true})
    isActive!: boolean;

    @Column('varchar', {unique: true})
    @IsNotEmpty({message: 'O email é obrigatório'})
    @IsEmail({}, { message: "O e-mail fornecido não é válido" })
    email!: string;

    
    @OneToMany(() => Post, (post) => post.user)
    posts: Post[]
}