import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
  maxAttempts: 3,
})

const uploadFileToS3 = async (fileName, file) => {
  const command = new PutObjectCommand({
    Bucket: 'rotux',
    Key: fileName,
    Body: await file.arrayBuffer(),
    ContentType: file.type || 'image/jpeg',
  })

  try {
    const response = await client.send(command)
    return response
  } catch (err) {
    // Log detallado para diagnosticar problemas de CORS o permisos en Capacitor
    console.error('========== ERROR S3 UPLOAD ==========')
    console.error('Nombre del error:', err.name)
    console.error('Mensaje:', err.message)
    console.error('Codigo HTTP:', err.$response?.statusCode)
    console.error('Codigo de error AWS:', err.Code || err.$fault)
    console.error('Request ID:', err.$metadata?.requestId)

    // Intentar leer el body de la respuesta cruda para ver el XML de error de AWS
    if (err.$response?.body) {
      try {
        const reader = err.$response.body.getReader()
        const { value } = await reader.read()
        const text = new TextDecoder().decode(value)
        console.error('Cuerpo raw de respuesta AWS:', text)
      } catch (bodyErr) {
        console.error('No se pudo leer el body de la respuesta:', bodyErr.message)
      }
    }

    // Informacion util para diagnosticar Capacitor (el origen no es http://localhost)
    console.error('Origin actual (window.location.origin):', window.location.origin)
    console.error('User-Agent:', navigator.userAgent)
    console.error('Completo del error:', JSON.stringify(err, null, 2))
    console.error('=====================================')

    throw err
  }
}

const deleteFileFromS3 = async (fileName) => {
  const command = new DeleteObjectCommand({
    Bucket: 'siadeg',
    Key: fileName,
  })

  try {
    const response = await client.send(command)
    return response
  } catch (error) {
    console.error('Error al eliminar el archivo:', error)
    throw error
  }
}

export { uploadFileToS3, deleteFileFromS3 }
