import { storeToRefs } from "pinia";
import { perfil } from "../store/perfil";

const usePerfil = () => {
    const storePerfil = storeToRefs(perfil());

    return {
        ...storePerfil,
        getFavoritos: perfil().getFavoritos,
        setFavoritos: perfil().setFavoritos,
        removeFavoritos: perfil().removeFavoritos,
        listarAudiosGuardados: perfil().listarAudiosGuardados,
        reproducirAudio: perfil().reproducirAudio,
        eliminarAudio: perfil().eliminarAudio,
        eliminarTodosLosAudios: perfil().eliminarTodosLosAudios
    }
}

export default usePerfil;