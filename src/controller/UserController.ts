import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import type { Request, Response, NextFunction } from "express";
import { BadRequestError, NotFoundError } from "../helpers/apiError";
import { validate } from "class-validator";
import { formatErrors } from "../helpers/formatErrors";

export class UserController{
    private userRepository = AppDataSource.getRepository(User);

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const{firstName, lastName, email, phone} = req.body;

            const emailCheck = await this.userRepository.findOneBy({email});
            if(emailCheck){
                throw new BadRequestError("Este email já está em uso.");
            }

            const newUser = this.userRepository.create({firstName, lastName, email, phone});
            const errors = await validate(newUser);
            if(errors.length > 0){
                const formattedErrors = formatErrors(errors);
                throw new BadRequestError("Falha na validação", formattedErrors);
            }
            await this.userRepository.save(newUser);
            return res.status(201).json({newUser})
        } catch (error: unknown) {
            next(error)           
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.userRepository.find();
            return res.json(users);
        } catch (error: unknown) {
            next(error)           
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            if(isNaN(id)){
                throw new BadRequestError("Id inválido.")
            }
            const result = await this.userRepository.delete(id);
            if(result.affected === 0){
                throw new NotFoundError("Usuário não encontrado.");
            }
            return res.status(204).send();
        } catch (error: unknown) {
            next(error)           
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const {firstName, lastName, email} = req.body;
            
            if(isNaN(id)){
                throw new BadRequestError("Id inválido.")
            }

            const user = await this.userRepository.findOneBy({id});
            if (!user) {
                throw new NotFoundError("Usuário não encontrado.");
            }

            const emailCheck = await this.userRepository.findOneBy({email});
            if(emailCheck){
                throw new BadRequestError("Este email já está em uso.");
            }
            //sobrescrever
            user.firstName = firstName ?? user.firstName;
            user.lastName = lastName ?? user.lastName;
            user.email = email ?? user.email;
            await this.userRepository.save(user);  //também existe o update para esses casos
            return res.status(200).json({message: "Usuário atualizado com sucesso.", user: user});

        } catch (error: unknown) {
            next(error);
        }
    }

    //getbyid
    listById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            if(isNaN(id)){
                throw new BadRequestError("Id inválido.")
            }
            const user = await this.userRepository.findOneBy({id});
            if(!user){
                throw new NotFoundError("Usuário não encontrado.");
            }
            return res.json(user);

        } catch (error: unknown) {
            next(error);
        }
    }

    //active e inactive user
    toggleActive = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            if(isNaN(id)){
                throw new BadRequestError("Id inválido.");
            }
            const user = await this.userRepository.findOneBy({id});
            if(!user){
                throw new NotFoundError("Usuário não encontrado.");
            }
            user.isActive = !user.isActive;
            await this.userRepository.save(user);
            return res.json({
                message:`Usuário ${user.isActive ? "ativado": "desativado"} com sucesso.`, user
            })
        } catch (error: unknown) {
            next(error);
        }
    }

    listActive = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.userRepository.findBy({isActive: true});
            return res.json(users);
        } catch (error: unknown) {
            next(error);
        }
    }
}