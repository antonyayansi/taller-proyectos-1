import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
    region: 'us-east-2',
    credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
    maxAttempts: 3,
});

const uploadFileToS3 = async (fileName, file) => {
    const command = new PutObjectCommand({
        // Bucket: 'siadeg',
        Bucket: 'siadegv2',
        Key: fileName,
        Body: await file.arrayBuffer(),
        ContentType: file.type || 'image/jpeg',
        // ACL removido - el bucket debe tener política pública configurada
    });

    try {
        const response = await client.send(command);
        return response;
    } catch (err) {
        console.error('Error uploading to S3:', err);
        throw err;
    }
};

const deleteFileFromS3 = async (fileName) => {
    const command = new DeleteObjectCommand({
        Bucket: 'siadeg',
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