import { Sequelize } from "sequelize";
import dotenv from dotenv;

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect : "postgres",
    protocol : "postgres",
    logging : false,
    ssl : {
        require : false,
        rejectUnauthorized : false,
    }
});

(async(()=>{
   try{
    sequelize.authenticate();
    console.log("Successfully connected to the db");
   }catch(error){
    console.error("Failed to connect to the db")
   }
}))()

export default sequelizes