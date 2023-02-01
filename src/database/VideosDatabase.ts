import { TVideosDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";


export class VideosDatabase extends BaseDatabase{

    public static TABLE_VIDEOS = "videos"

    public async findVideos (q: string | undefined){

        let videosDB

        if (q) {
            const result = await BaseDatabase.connection(VideosDatabase.TABLE_VIDEOS).where("title", "LIKE", `%${q}%`)
            videosDB = result
        } else {
            const result = await BaseDatabase.connection(VideosDatabase.TABLE_VIDEOS)
            videosDB = result
        }

        return videosDB
    }

    public async findVideoById(id: string | undefined): Promise <TVideosDB | undefined>{
        const [videoDBExist]: TVideosDB[] | undefined[] = await BaseDatabase
        .connection(VideosDatabase.TABLE_VIDEOS)
        .where({id})
        return videoDBExist
    }

    public async insertVideo(newVideoDB: TVideosDB): Promise <void>{
        await BaseDatabase.connection(VideosDatabase.TABLE_VIDEOS).insert(newVideoDB)

    }

    public async updateVideoById(id: string, newVideoDB: TVideosDB): Promise <void>{
        await BaseDatabase
        .connection(VideosDatabase.TABLE_VIDEOS)
        .update(newVideoDB)
        .where({id: id})
    }

    public async deleteVideo(id: string | undefined){
        await BaseDatabase.connection(VideosDatabase.TABLE_VIDEOS).del().where({id})
    }




}