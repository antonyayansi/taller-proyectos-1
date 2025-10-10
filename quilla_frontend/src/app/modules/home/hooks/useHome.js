import { storeToRefs } from 'pinia'
import { home } from '../store/home'

const useHome = () => {
  const storeHome = storeToRefs(home())

  return {
    ...storeHome,
    obtenerUbicacion: home().obtenerUbicacion,
    getMapa: home().getMapa,
    setMapContainer: home().setMapContainer,
  }
}

export default useHome
