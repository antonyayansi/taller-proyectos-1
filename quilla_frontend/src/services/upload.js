import { uploadFileToS3 } from './aws'

/**
 * Sube una imagen a AWS S3 y retorna la URL pública
 * @param {File} file - Archivo de imagen a subir
 * @returns {Promise<string|null>} URL de la imagen o null si hay error
 */
export const uploadPostImage = async (file) => {
  try {
    if (!file) {
      throw new Error('No se proporcionó ningún archivo')
    }

    console.log('🔍 Validando archivo:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen')
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('La imagen no debe superar los 5MB')
    }

    // Generar nombre único para la imagen
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const fileName = `posts/${timestamp}-${randomString}.${extension}`

    console.log('⬆️ Subiendo a S3 con nombre:', fileName)

    // Subir a S3
    const response = await uploadFileToS3(fileName, file)

    if (!response) {
      throw new Error('Error al subir la imagen a S3')
    }

    console.log('✅ Respuesta de S3:', response)

    // Construir URL pública de la imagen
    const imageUrl = `https://siadegv2.s3.us-east-2.amazonaws.com/${fileName}`

    console.log('🔗 URL generada:', imageUrl)

    return imageUrl
  } catch (error) {
    console.error('❌ Error uploading post image:', error)
    throw error // Lanzar el error para que se maneje arriba
  }
}

/**
 * Comprime una imagen antes de subirla
 * @param {File} file - Archivo de imagen
 * @param {number} maxWidth - Ancho máximo
 * @param {number} quality - Calidad de compresión (0-1)
 * @returns {Promise<File>} Imagen comprimida
 */
export const compressImage = async (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calcular nuevas dimensiones manteniendo proporción
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // Determinar el tipo de imagen, default a JPEG si no es PNG
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        
        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al comprimir la imagen'))
              return
            }
            
            // Crear un nuevo archivo con el blob
            const compressedFile = new File([blob], file.name, {
              type: mimeType,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          },
          mimeType,
          quality
        )
      }

      img.onerror = () => reject(new Error('Error al cargar la imagen'))
      img.src = e.target.result
    }

    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsDataURL(file)
  })
}
