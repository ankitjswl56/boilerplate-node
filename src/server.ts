import express,{Request, Response} from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/', (req: Request,res: Response)=>{
    try {
        res.status(200).json({message: 'PONG'}).end();
    } catch(error){
        res.status(400).json({message: `${error}`}).end();
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`You are connected at ${PORT}`);
});
