import { Connection } from 'mysql2/promise';
import { NewUserFields, UpdateUserFields } from '../../interfaces/utils/users/usersUtilsInterface';
import { PatchUser } from '../../interfaces/utils/users/usersUtilsInterface';
import CryptoJS from 'crypto-js';
import users from '../../controllers/users';


export class UsersUtils{
    private databaseConexion: Connection;
    
    
    constructor(db: Connection){
        this.databaseConexion = db;
    }

    

    async getUsers(): Promise<any> {
        const query = "SELECT * FROM users"
        const [rows] = await this.databaseConexion.query(query)
        return rows
    }
    async getUsersById(id: string): Promise<any>  {
        const query ="SELECT * FROM users WHERE id =" + id;
        const [rows] =  await this.databaseConexion.query(query)
        return rows;
    }

    async getUserByEmail(email: string): Promise<any>{
        const preparedQuery = "SELECT * FROM users WHERE email =?";
        const [rows] =await this.databaseConexion.query(preparedQuery, [email])
        return rows;
    }

    async createUser(params: NewUserFields){
        const{
            names,
            lastNames,
            email,
            password,
        } = params;
        const users = await this.getUserByEmail(email);
        if (users.length > 0){
            return Promise.reject('El usuario yaa existe');
        }
        const encryptedPassword= CryptoJS.AES.encrypt(password, process.env.WHATSAPP_SECRET_KEY ).toString();
        const preparedQuery = "INSERT INTO users (names, lastNames, email, password) VALUES (?, ?, ?, ?)";
        const [rows] =await this.databaseConexion.query(preparedQuery, [names, lastNames, email, encryptedPassword])
        return rows;
    }

    async updateUser(params: UpdateUserFields){
        const{
            names,
            lastNames,
            email,
            password,
            id,
        } = params;
        const users =await this.getUsersById(id);
        if (users.length === 0){
            return Promise.reject('El usuario no existe');
        }
        const encryptedPassword= CryptoJS.AES.encrypt(password, process.env.WHATSAPP_SECRET_KEY ).toString();
        const preparedQuery = "UPDATE users SET names = ?, lastNames= ?, email = ?, password = ? WHERE id= ?";
        const [rows] =await this.databaseConexion.query(preparedQuery, [names, lastNames, email, encryptedPassword, id])
        return rows;
    }

    async patchUser(params: PatchUser){
        const{
            names,
            lastNames,
            email,
            password,
        } = params;
        const users =await this.patchUser;

        const updateFields = [
            names && `names = '${names}'`,
            lastNames && `lastNames = '${lastNames}'`,
            email && `email = '${email}'`,
            password && `password = '${password}'`,
        ];
    
        if (updateFields.length === 0) {
            
            return null; 
        }
    
        
        const encryptedPassword= CryptoJS.AES.encrypt(password, process.env.WHATSAPP_SECRET_KEY ).toString();
        const preparedQuery = `UPDATE users SET ${updateFields.join(', ')}`;
        const [rows] = await this.databaseConexion.query(preparedQuery, encryptedPassword);
            return rows;
        
    }
}


