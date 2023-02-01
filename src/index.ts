import express, { Request, Response } from 'express'
import cors from 'cors'
// import { db } from './database/BaseDatabase'
import { VideosDatabase } from './database/VideosDatabase'
import { TVideosDB } from './types'
import { VideoController } from './controller/VideoController'
import { Videos } from './models/Videos'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

const videoDatabase = new VideoController()

app.get("/videos", videoDatabase.getVideos)

app.post("/videos", videoDatabase.createVideo)


app.put("/videos/:id", async (req: Request, res: Response) => {
    try {

        const idToEdit = req.params.id

        const { id, title, duration} = req.body

        if (typeof idToEdit !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof title !== "string") {
            res.status(400)
            throw new Error("'title' deve ser string")
        }

        if (typeof duration !== "number") {
            res.status(400)
            throw new Error("'duration' deve ser um number")
        }

        const videosDatabase = new VideosDatabase()
        const [videosDB] = await videosDatabase.findVideos(idToEdit)

        if (!videosDB) {
            res.status(404)
            throw new Error("'id' não encontrado")
        }

        if(videosDB){
            //1 - INSTANCIAR os dodos vindos do body
            const video = new Videos(
                id || idToEdit ,
                title || videosDB.title,
                duration || videosDB.duration,
                new Date().toISOString()
            )
    
            //2 - Objeto simples para MODELAR as informações para o banco de dados
            const newVideoDB = {
                id: video.getId(),
                title: video.getTitle(),
                duration: video.getDuration(),
                upload_date: video.getUploadDate()
            }
    
            video.setTitle(newVideoDB.title)
            video.setDuration(newVideoDB.duration)

            await videosDatabase.updateVideoById(idToEdit, newVideoDB)

            res.status(201).send({ message: "Video editado com sucesso",
            video: newVideoDB})
        }
        
   

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.delete("/videos/:id", videoDatabase.deleteVideo)