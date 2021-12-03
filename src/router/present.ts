// Получение списка подарков
import Express, {Request, Response} from "express";
import Present from "../model/present";

const router = Express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const presents = await Present.find()
        res.status(200).json(presents)
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Internal server error'})
    }
})

export default router;