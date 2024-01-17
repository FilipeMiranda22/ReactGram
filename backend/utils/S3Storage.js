const path = require("path");
const fs = require("fs");
const aws = require("aws-sdk");
const mime = require("mime");

class S3Storage {
  constructor() {
    this.client = new aws.S3({
      region: "sa-east-1",
    });
  }

  async saveFile(filename, fieldname) {
    const originalPath = path.resolve(
      `https://backend-reactgram.onrender.com/uploads/${
        fieldname === "image" ? "photos" : "users"
      }`,
      filename
    );

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error("File not found");
    }

    const fileContent = await fs.promises.readFile(originalPath);

    this.client
      .putObject({
        Bucket: "reactgramimg",
        Key: `${fieldname === "image" ? "photos" : "users"}/${filename}`,
        ACL: "public-read",
        Body: fileContent,
        ContentType,
      })
      .promise();

    //await fs.promises.unlink(originalPath);
  }

  async deleteFile(filename) {
    await this.client
      .deleteObject({
        Bucket: "aula-youtube",
        Key: filename,
      })
      .promise();
  }
}

module.exports = S3Storage;
