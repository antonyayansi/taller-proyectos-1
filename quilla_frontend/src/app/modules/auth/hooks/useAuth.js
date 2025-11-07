import { storeToRefs } from "pinia";
import { auth } from "../store/auth";

const useAuth = () => {
    const storeAuth = storeToRefs(auth());

    return {
        ...storeAuth,
        getUser: auth().getUser,
    }
}

export default useAuth;