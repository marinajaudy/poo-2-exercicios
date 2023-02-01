import { Request, Response } from "express"
import { VideosDatabase } from "../database/VideosDatabase"
import { Videos } from "../models/Videos"
import { TVideosDB } from "../types"

export class VideoController{

    public getVideos = async (req: Request, res: Response) => {
        try {
            const q = req.query.q as string | undefined
    
            const videosDatabase = new VideosDatabase()
            const videosDB = await videosDatabase.findVideos(q)
    
            const videos: Videos[] = videosDB.map((videoDB) => new Videos(
                videoDB.id,
                videoDB.title,
                videoDB.duration,
                videoDB.uploadDate
            ))
    
            res.status(200).send(videos)
    
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
    }

    public createVideo = async (req: Request, res: Response) => {
        try {
    
            const { id, title, duration } = req.body
    
            if (typeof id !== "string") {
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
            const videoDBExist = await videosDatabase.findVideoById(id)
            
            if (videoDBExist) {
                res.status(400)
                throw new Error("'id' já existe")
            }
    
            //1 - INSTANCIAR os dodos vindos do body
            const newVideo = new Videos(
                id,
                title,
                duration,
                new Date().toISOString()
            )
    
            //2 - Objeto simples para MODELAR as informações para o banco de dados
            const newVideoDB: TVideosDB = {
                id: newVideo.getId(),
                title: newVideo.getTitle(),
                duration: newVideo.getDuration(),
                upload_date: newVideo.getUploadDate()
    
            }
    
    
            videosDatabase.insertVideo(newVideoDB)
    
            res.status(201).send({
                message: "Vídeo criado com sucesso",
                video: newVideo})
    
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
    }

    // public editVideo =

    public deleteVideo = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
    
            const videoDatabase = new VideosDatabase()
            const videoExist = await videoDatabase.findVideoById(id)
    
            if (!videoExist) {
                res.status(404)
                throw new Error("Id não encontrado")
            }
    
            if (videoExist) {
                await videoDatabase.deleteVideo(id)
            }
    
            res.status(200).send({ message: "Vídeo deletado com sucesso" })
    
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
    }
}