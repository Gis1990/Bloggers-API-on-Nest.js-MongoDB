import { Injectable } from "@nestjs/common";
import { DeleteObjectsCommand, ListObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class S3StorageAdapter {
    private s3Client: S3Client;

    constructor(private configService: ConfigService) {
        const REGION = "eu-central-1";
        this.s3Client = new S3Client({
            region: REGION,
            credentials: {
                accessKeyId: this.configService.get<string>("aws_access_key_id"),
                secretAccessKey: this.configService.get<string>("aws_secret_access_key"),
            },
            endpoint: "https://s3.eu-central-1.amazonaws.com",
        });
    }

    public async saveFile(
        blogId: string,
        originalName: string,
        typeImageDir: string,
        userId: string,
        buffer: Buffer,
        image: string,
    ): Promise<any> {
        const bucketParams = {
            Bucket: "bloggersbucket",
            Key: `${userId}/${typeImageDir}/${blogId}/${image}/${uuidv4()}`,
            Body: buffer,
            ContentType: "image/png",
        };
        const command = new PutObjectCommand(bucketParams);
        try {
            await this.s3Client.send(command);
        } catch (e) {
            throw new Error(e);
        }
        return {
            url: `https://bloggersbucket.s3.eu-central-1.amazonaws.com/${bucketParams.Key}`,
        };
    }

    public async deleteFolder(bucketName: string, folderPath: string): Promise<void> {
        const listObjectsParams = {
            Bucket: bucketName,
            Prefix: folderPath,
        };
        const listObjectsCommand = new ListObjectsCommand(listObjectsParams);
        const listObjectsOutput = await this.s3Client.send(listObjectsCommand);

        const deleteObjectsParams = {
            Bucket: bucketName,
            Delete: { Objects: [] },
        };
        if (!listObjectsOutput) {
            if (listObjectsOutput.Contents.length > 0) {
                listObjectsOutput.Contents.forEach((content) => {
                    deleteObjectsParams.Delete.Objects.push({ Key: content.Key });
                });
                const deleteObjectsCommand = new DeleteObjectsCommand(deleteObjectsParams);
                await this.s3Client.send(deleteObjectsCommand);
            }
        }
    }
}
