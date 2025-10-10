import { storeToRefs } from "pinia"
import { sitios } from "../store/sitios"

const useSitios = () => {
    const sitiosStore = storeToRefs(sitios())

    return {
        ...sitiosStore,
        getSitios: sitios().getSitios,
        searchSitios: sitios().searchSitios,
        addSitesToMap: sitios().addSitesToMap,
    }
}

export default useSitios;