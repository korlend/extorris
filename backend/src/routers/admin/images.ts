import express, { Request, Response, NextFunction } from "express";
import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import ImageService from "@src/services/ImageService.js";
import FileHandler from "@src/core/utils/FileHandler.js";
import ConfigLoader from "@src/core/config/ConfigLoader.js";

import path from "path";
import PropagatedError from "@src/models/PropagatedError.js";
import { ImageModel } from "@src/models/db/index.js";

import multer from "multer";
import { randomUUID } from "crypto";

const router = express.Router();

router.post(
  "/reindex",
  async (req: Request, res: Response, next: NextFunction) => {
    const imagesService = new ImageService();
    const config = ConfigLoader.getInstance();
    const imagesDirectory = config?.get("imagesDirectory");

    if (!imagesDirectory) {
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        "Images directory is not set",
      );
    }

    const fullPath = path.resolve(imagesDirectory);

    const filenames = FileHandler.getDirFilenames(fullPath);
    const addedImages: Array<ImageModel> = [];

    for (let i = 0; i < filenames.length; i++) {
      const filename = filenames[i];
      let image = await imagesService.getBy("relative_path", filename);
      if (image) {
        continue;
      }
      image = new ImageModel();
      image.relative_path = filename;
      addedImages.push(await imagesService.create(image));
    }

    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        addedImages: addedImages.map((v) => v.prepareREST()),
      }),
    );
  },
);

const storage = multer.diskStorage({
  destination: "./public/images",
  filename: (req, file, callback) => {
    callback(null, `${randomUUID()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post(
  "/create_file",
  // @ts-ignore idk
  upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    const filename = req.file?.filename;
    next(
      ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
        filename,
      }),
    );
  },
);

export default router;
