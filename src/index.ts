import "reflect-metadata";
import { AppDataSource } from "./data-source";
import express, { Application } from "express";
import { userRoutes } from "./routes/userRoutes";
import { postRoutes } from "./routes/postRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app: Application = express();
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes)
app.use(errorMiddleware);

AppDataSource.initialize().then(() => {
    console.log("Banco conectado");
    app.listen(process.env.PORT, () => {
        console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
    });
}).catch((error) => console.log(""))




/* //Função de teste de conxão no banco de dados
import { User } from "./entity/User";

async function main(){
    try {
        await AppDataSource.initialize();
        console.log("Banco conectado!");

        const userRepository = AppDataSource.getRepository(User);

        const newUser = userRepository.create({
            firstName: "Marco",
            lastName: "Hansen"
        });
        await userRepository.save(newUser);
        const allUsers = await userRepository.find();
        console.log("Usuarios cadastrados: ", allUsers);
        
    } catch (error) {
        console.log(error)
    }
}

//chamamos a main para testar se está conectando com o banco:
main()
*/
