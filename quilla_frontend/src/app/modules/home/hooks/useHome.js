import { storeToRefs } from 'pinia'
import { home } from '../store/home'

const useHome = () => {
  const storeHome = storeToRefs(home())

  return {
    ...storeHome,
    obtenerUbicacion: home().obtenerUbicacion,
    getMapa: home().getMapa,
    setMapContainer: home().setMapContainer,
    playAudio: home().playAudio,
    togglePlayPause: home().togglePlayPause,
    stopAudio: home().stopAudio,
    seekAudio: home().seekAudio,
    setVolume: home().setVolume,
    setLoading: home().setLoading,
  }
}

export default useHome
