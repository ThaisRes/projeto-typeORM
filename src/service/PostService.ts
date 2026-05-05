import { AppDataSource } from "../data-source";
import { Post } from "../entity/Post";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../helpers/apiError";
import { validate } from "class-validator";
import { formatErrors } from "../helpers/formatErrors";
import { User, UserRole } from "../entity/User";

export class PostService {
    private postRepository = AppDataSource.getRepository(Post);
    private userRepository = AppDataSource.getRepository(User);

    validateSchema = async(data:Partial<Post>, partial = false) => {
        const temp = this.postRepository.create(data);
        const errors = await validate(temp, {skipMissingProperties: partial});
        if (errors.length > 0) {
            const formattedErrors = formatErrors(errors);
            throw new BadRequestError("Falha de validação", formattedErrors);
        }
    };

    listAll = async() => {
        return await this.postRepository.find({relations: ["user"]});
    };

    create = async(title: string, content: string, userId: number) => {
        const user = await this.userRepository.findOneBy({id:userId});
        if(!user){
            throw new NotFoundError("Usuário não encontrado")
        }

        return await this.postRepository.save({title, content, user});
    }

    update = async (postId: number, userId: number, userRole: UserRole, data: Partial<Post>) => {
        const post = await this.postRepository.findOne({where: {id:userId}, relations: ["user"]});
        if(!post) {
            throw new NotFoundError("Post não encontrado.")
        }

        if(userRole !== UserRole.USER){
            throw new UnauthorizedError("Você não tem permissão para atualizar esse post.")
        }

        if(post.user.id!== userId){
            throw new UnauthorizedError("Você não tem permissão para atualizar esse post.")
        }
            
        this.postRepository.merge(post, data);
        return await this.postRepository.save(post);   
    }

    delete = async (id: number, userId: number, userRole: UserRole) => {
        const post = await this.postRepository.findOneBy({id});
        if(!post){
            throw new NotFoundError("Post não encontrado.")
        }

        if(userRole !== UserRole.ADMIN && userRole !== UserRole.USER){
            throw new UnauthorizedError("Você não tem permissão para deletar esse post.")
        }

        if(post.user.id!== userId){
            throw new UnauthorizedError("Você não tem permissão para atualizar esse post.")
        }
        return await this.postRepository.delete(id);
    }
}