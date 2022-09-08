import axios from "axios";
import { response } from "express";
import fs from "fs";
import Jimp = require("jimp");

const path = require( "path" );
const folder = path.resolve('./src/util/tmp');


// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}

export async function validateImage(url: string) {

  const validImage = await axios.get(url).then(
    (resp) => {
      if (resp.status !== 200){
        throw new Error("Image not found")
      }
      if (!resp.headers["content-type"].includes("image")) {
        throw new Error("Invalid image type")
      } 
    }
  ).catch((err) => {
    return err["message"]
  })
  return validImage
}



export function getFiles() {
 const files: any[] = [];
 fs.readdirSync( folder ).forEach( file => {
    const absolutePath = path.resolve( folder, file );
    files.push(absolutePath)
 });
 return files
}

