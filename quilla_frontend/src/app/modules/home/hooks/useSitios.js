import { storeToRefs } from "pinia"
import { sitios } from "../store/sitios"

const useSitios = () => {
    const sitiosStore = storeToRefs(sitios())

    return {
        ...sitiosStore,
        getSitios: sitios().getSitios,
        searchSitios: sitios().searchSitios,
        addSitesToMap: sitios().addSitesToMap,
        getSitiosById: sitios().getSitiosById,
        textToSpeech: sitios().textToSpeech,
        getReseniasBySitioId: sitios().getReseniasBySitioId,
        addNewResenia: sitios().addNewResenia,
    }
}

export default useSitios;