import app from "."
import { AppDataSource } from "./database/app-data-source"

// establish database connection
AppDataSource
    .initialize()
    .then(result=>{        
        if(result){
            void app.listen({host:"0.0.0.0",port:8000})
            console.log(`App Started Succesfully!`);
            return {connectionStatus:true}
        }
    })
    .then((status)=>{
        console.log(`DB connection status is ${status?.connectionStatus}`);
    })
    .catch(exception=>{
        console.error(exception)
    })