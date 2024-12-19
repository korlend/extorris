
import * as fs from 'fs'

export default class FileHandler {
  static readFile(path: string, encoding: BufferEncoding = 'utf-8'): Object {
    return new Promise((resolve, reject) => {
        fs.readFile(path, { encoding }, (err: any, body: any) => {
        if (err) {
          reject(err)
          throw(err)
        }
        resolve(JSON.parse(body))
      })
    })
  }

  static mkDir(path: string, options: string | number | fs.MakeDirectoryOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.mkdir(path, options, () => {
        resolve()
      })
    })
  }

  static getDirFilenames(path: string): Array<string> {
    try {
      const files = fs.readdirSync(path)
      return files
    } catch (e) {
      return []
    }
  }
}
