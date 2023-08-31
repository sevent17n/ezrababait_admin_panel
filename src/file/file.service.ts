import { Injectable } from "@nestjs/common"
import { FileResponse } from "./file.interface"
import { path } from "app-root-path"
import { ensureDir, writeFile } from "fs-extra"

@Injectable()
export class FileService {
  async saveFiles(
    files: Express.Multer.File[],
    folder = "default"
  ): Promise<FileResponse[]> {
    const uploadFolder = `${path}/uploads/${folder}`
    await ensureDir(uploadFolder)
    return await Promise.all(
      files.map(async (file) => {
        await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer)
        console.log(`/uploads/${folder}/${file.originalname}`)
        return {
          url: `/uploads/${folder}/${file.originalname}`,
          name: file.originalname
        }
      })
    )
  }
}
