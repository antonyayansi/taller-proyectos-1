import { storeToRefs } from 'pinia'
import { home } from '../store/home'

const useHome = () => {
  const storeHome = storeToRefs(home())

  return {
    ...storeHome,
    obtenerUbicacion: home().obtenerUbicacion,
    iniciarSeguimientoUbicacion: home().iniciarSeguimientoUbicacion,
    detenerSeguimientoUbicacion: home().detenerSeguimientoUbicacion,
  }
}

export default useHome
