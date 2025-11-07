import { storeToRefs } from "pinia";
import { perfil } from "../store/perfil";

const usePerfil = () => {
    const storePerfil = storeToRefs(perfil());

    return {
        ...storePerfil,
        getFavoritos: perfil().getFavoritos,
        setFavoritos: perfil().setFavoritos,
    }
}

export default usePerfil;