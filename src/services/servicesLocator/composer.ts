//va agregar y obtener el objeto que se va a crear en locatot
import {Connection} from "mysql2/promise"
import { DependencyLocator } from "./dependenciesLocator";
import dbService from "../database/database.service";
import { UsersUtils } from "../../utils/users/usersUtils";
import { UsersUtilsInterface } from "../../interfaces/utils/users/usersUtilsInterface";


export const di = DependencyLocator.getInstance();

const types ={
    database: "database",
    usersUtils: "UsersUtils"
}

export async function init(){
    const db = await dbService;
    di.bindLazySingleton(types.database,  () => db);
    di.bindFactory(types.usersUtils , () => new UsersUtils(
        getDatabase() //inyeeccion de dependencias
    ))
}

function getDatabase(): Connection {
    return di.get(types.database)
}

export function getUsersUtils(): UsersUtilsInterface {
    return di.get(types.usersUtils)
}