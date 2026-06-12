import { storeToRefs } from "pinia"
import { navigate } from "../store/navigate"

const useNavigation = () => {
    const navigationStore = storeToRefs(navigate())

    return {
        ...navigationStore,
        getSitiosById: navigate().getSitiosById,
    }
}

export default useNavigation;