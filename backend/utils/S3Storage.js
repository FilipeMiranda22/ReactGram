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
    const imageUrl = `https://backend-reactgram.onrender.com/uploads/${
      fieldname === "image" ? "photos" : "users"
    }/${filename}`;

    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image from ${imageUrl}. Status: ${response.status}`
      );
    }

    const fileContent = await response.arrayBuffer();

    const ContentType = mime.getType(filename);

    if (!ContentType) {
      throw new Error("File not found");
    }

    this.client
      .putObject({
        Bucket: "reactgramimg",
        Key: `${fieldname === "image" ? "photos" : "users"}/${filename}`,
        ACL: "public-read",
        Body: Buffer.from(fileContent),
        ContentType,
      })
      .promise();
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
