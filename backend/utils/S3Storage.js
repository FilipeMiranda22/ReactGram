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

  async saveFile(filename, fieldname, file) {
    // const imageUrl = `https://backend-reactgram.onrender.com/uploads/${
    //   fieldname === "image" ? "photos" : "users"
    // }/${filename}`;

    // try {
    //   const response = await fetch(imageUrl);

    //   console.log(response);

    //   if (!response.ok) {
    //     throw new Error(
    //       `Failed to fetch image from ${imageUrl}. Status: ${response.status}`
    //     );
    //   }

    //   const fileContent = await response.arrayBuffer();

    console.log(file.buffer);

    const ContentType = mime.getType(path.extname(file.originalname));

    if (!ContentType) {
      throw new Error("File not found");
    }

    this.client
      .putObject({
        Bucket: "reactgramimg",
        Key: `${fieldname === "image" ? "photos" : "users"}/${filename}`,
        ACL: "public-read",
        Body: file.buffer,
        ContentType,
      })
      .promise()
      .catch((err) => {
        console.log(err);
      });

    //await fs.promises.unlink(originalPath);
  }

  async deleteFile(filename) {
    await this.client
      .deleteObject({
        Bucket: "reactgramimg",
        Key: filename,
      })
      .promise();
  }
}

module.exports = S3Storage;
