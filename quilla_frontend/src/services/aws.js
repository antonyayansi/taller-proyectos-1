import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
    maxAttempts: 3,
});

const uploadFileToS3 = async (fileName, file) => {
    const command = new PutObjectCommand({
        Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
        Key: fileName,
        Body: await file.arrayBuffer(),
    });

    try {
      const response = await client.send(command);
      return response;
    } catch (err) {
      console.error(err);
    }
  };

const deleteFileFromS3 = async (fileName) => {
    const command = new DeleteObjectCommand({
        Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
        Key: fileName,
    });

    try {
        const response = await client.send(command);
        return response;
    } catch (error) {
        console.error('Error al eliminar el archivo:', error);
        throw error;
    }
};

export {
    uploadFileToS3,
    deleteFileFromS3
};