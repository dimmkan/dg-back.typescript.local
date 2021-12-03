import Express, {Request, Response} from 'express';
import Player from "../model/player";
import Present from "../model/present";

const router = Express.Router();

// Получение всех игроков
router.get('/', async (req: Request, res: Response) => {
    try {
        const players = await Player.find()
        res.status(200).json(players)
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Internal server error'})
    }
});

// Добавление игрока
router.post('/add', async (req: Request, res: Response) => {
    try {
        const player = new Player({
            porps: req.body.props,
            resourses: req.body.resourses,
            outPresCnt: 10
        })
        await player.save()
        res.status(201).json(player)
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Internal server error'})
    }
})

// Загрузка тестовых данных
router.post('/load', async (req: Request, res: Response) => {
    try {
        const props = [
            {propName: 'testProp1', propValue: 10},
            {propName: 'testProp2', propValue: 15},
            {propName: 'testProp3', propValue: 20},
        ]
        const resourses = [
            {resName: 'money', resValue: 100},
            {resName: 'Crystals', resValue: 700},
        ]

        for (let i = 0; i < 5; i++) {
            const player = new Player({
                props: props,
                resourses: resourses,
                outPresCnt: 10
            })
            await player.save()
        }
        res.status(200).json({message: 'Done'})
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Internal server error'})
    }
})

// Добавить n единиц ресурсов для игрока по id
router.put('/addresourse/:id', async (req: Request, res: Response) => {
    try {
        let player = await Player.findById(req.params.id)
        // @ts-ignore
        const resourses = player.resourses
        const resourse = resourses.find(element => {
            if (element.resName.toLowerCase() === req.query.name.toLowerCase()) {
                return true
            } else {
                return false
            }
        })
        if (resourse) {
            resourse.resValue += +req.query.cnt;
            // @ts-ignore
            await player.save()
            res.status(200).json({message: 'Done', player})
        }
        else{
            res.status(200).json({message: 'Undone', player})
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Internal server error'})
    }
})

// Убрать n единиц ресурсов для игрока по id
router.put('/reduceresourse/:id', (req: Request, res: Response,) => {
    try {
        // @ts-ignore
        Player.findById(req.params.id, async function (err, player) {
            const resourses = player.resourses
            // @ts-ignore
            const resourse = resourses.find(element => {
                if (element.resName.toLowerCase() === req.query.name.toLowerCase()) {
                    return true
                } else {
                    return false
                }
            })
            if (resourse) {
                resourse.resValue -= +req.query.cnt;
                await player.save()
                return res.status(200).json({message: 'Done', player})
            }
            return res.status(200).json({message: 'Undone', player})
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Internal server error'})
    }
})

// Получение списка игроков и изменение ресурса
router.put('/setresourse', async (req: Request, res: Response) => {
    try {
        const players = await Player.find({'props.propName': req.query.prop})
        for (const player of players) {
            const resourse = player.resourses.find(el => {
                return el.resName.toLowerCase() === req.query.res.toLowerCase() ? true : false
            })
            if (resourse) {
                if (req.query.action.toLowerCase() === 'add') {
                    resourse.resValue += +req.query.cnt;
                } else if (req.query.action.toLowerCase() === 'reduce') {
                    resourse.resValue -= +req.query.cnt;
                }
                await player.save()
            }
        }
        res.status(200).json(players)
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Internal server error'})
    }

})

// Дарение подарка (:id - идентификатор пользователя, который дарит подарок)
router.put('/givepresent/:id', async (req: Request, res: Response) => {
    try {
        const who = await Player.findById(req.params.id)
        const players = await Player.find({_id: {'$in': req.body.ids}})

        // Счетчик - это минимальное число между количеством пришедших получателей и остатком подарков
        // @ts-ignore
        const counter = Math.min(players.length, who.outPresCnt)

        // Если больше подарков нет - вернем сообщение об этом
        if (counter) {
            for (let i = 0; i < counter; i++) {
                const player = players[i]
                const resourse = player.resourses.find(el => {
                    // @ts-ignore
                    return el.resName.toLowerCase() === req.body.resourse.toLowerCase() ? true : false
                })
                if (resourse) {
                    // @ts-ignore
                    resourse.resValue += +req.body.count;
                    await player.save()

                    const present = new Present({
                        // @ts-ignore
                        sender: who._id,
                        recipient: player._id,
                        resourse: resourse.resName,
                        resVal: +req.body.count
                    })

                    await present.save()
                }
                // @ts-ignore
                who.outPresCnt--
            }
            // @ts-ignore
            await who.save()
            res.status(200).json(players)
        } else {
            res.status(200).json({message: 'No more presents'})
        }
    } catch
        (e) {
        console.log(e)
        res.status(500).json({message: 'Internal server error'})
    }
})


export default router;