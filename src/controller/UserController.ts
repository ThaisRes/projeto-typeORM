import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import type { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../helpers/apiError";
//import { validate } from "class-validator";
//import { formatErrors } from "../helpers/formatErrors";
//import bcrypt from "bcryptjs";
import { UserService } from "../service/UserService";


export class UserController{
    private userRepository = AppDataSource.getRepository(User);
    private userService = new UserService;

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
        /*const { firstName, lastName, phone, email, password } = req.body;
        const newUser = this.userRepository.create({
            firstName,
            lastName,
            email,
            password, //hashedPassword
            phone,
        });       

        const tempUser = this.userRepository.create(req.body);
        const errors = await validate(tempUser)
        if (errors.length > 0) {
            const formattedErrors = formatErrors(errors);
            throw new BadRequestError("Falha de validação", formattedErrors);
        }
        */
       
       /*
       const errors = await validate(newUser);
       if (errors.length > 0) {
            const formattedErrors = formatErrors(errors);
            throw new BadRequestError("Falha de validação", formattedErrors);
            }
            
            const exists = await this.userRepository.findOneBy({ email });
            if (exists) {
                throw new BadRequestError("Email fornecido já está em uso!");
                }
                
                const hashedPassword = await bcrypt.hash(password, 10);
                newUser.password = hashedPassword;
                
                await this.userRepository.save(newUser);
                const { password: _, ...userPublic } = newUser;
        */

       await this.userService.create(req.body);
       const newUser = await this.userService.create(req.body);
       const { password: _, ...userPublic } = newUser;
        return res.status(201).json(userPublic);
        } catch (error: unknown) {
            next(error);
        }
    };
      
    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            //const users = await this.userService.find();
            const users = await this.userService.listAll();
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
            /*const result = await this.userRepository.delete(id);
            if(result.affected === 0){
                throw new NotFoundError("Usuário não encontrado.");
            }*/
            await this.userService
            return res.status(204).send();
        } catch (error: unknown) {
            next(error)           
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            //const id = Number(req.params.id);
            /*const { firstName, lastName, email, phone, password } = req.body;
            if (id && isNaN(id)) {
                throw new BadRequestError("ID inválido");
            }
            
            const user = await this.userRepository.findOneBy({ id });
            if (!user) {
                throw new NotFoundError("Usuário não encontrado");
            }
            
            if (email && email !== user.email) {
                const exists = await this.userRepository.findOneBy({ email });
                if (exists) {
                throw new BadRequestError(
                    "Este e-mail já está em uso por outro usuário!"
                );
                }
                user.email = email;
            }
            
            user.firstName = firstName ?? user.firstName;
            user.lastName = lastName ?? user.lastName;
            user.phone = phone ?? user.phone;
            if (password) {
                user.password = password;
            }
            
            const errors = await validate(user, { skipMissingProperties: true });
            if (errors.length > 0) {
                const formattedErrors = formatErrors(errors);
                throw new BadRequestError("Falha de validação", formattedErrors);
            }

            if (password) {
                user.password = await bcrypt.hash(password, 10);
            }            
            await this.userRepository.save(user);

        */
            const id = req.user_id;
            await this.userService.validateSchema(req.body, true);
            const user = await this.userService.update(id!, req.body);

            const { password: _, ...userPublic } = user;
            return res.status(200).json(userPublic);
            } catch (error: unknown) {
            next(error);
        }
    };

    //getbyid
    listById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            if(isNaN(id)){
                throw new BadRequestError("Id inválido.")
            }
            /*const user = await this.userRepository.findOneBy({id});
            if(!user){
                throw new NotFoundError("Usuário não encontrado.");
            }
            */
            const user = await this.userService.listById(id);
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
            /*const user = await this.userRepository.findOneBy({id});
            if(!user){
                throw new NotFoundError("Usuário não encontrado.");
            }
            user.isActive = !user.isActive;
            await this.userRepository.save(user);
            */
            const user = await this.userService.toggleActive(id);
            return res.json({
                message:`Usuário ${user.isActive ? "ativado": "desativado"} com sucesso.`, user
            });            
        } catch (error: unknown) {
            next(error);
        }
    }

    listActive = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.userService.listActive();
            return res.json(users);
        } catch (error: unknown) {
            next(error);
        }
    }
}