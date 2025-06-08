import { useDispatch, useSelector } from "react-redux";
import { changeLanguageApp, changeSkin } from "../../redux/store/actions/appActions";

const useSkin = () => {
    const dispatch = useDispatch();

    const skin = useSelector(state => state.app.skin);
    const language = useSelector(state => state.app.language);


    const changeSkinRedux = (newSkin) => {
        dispatch(changeSkin(newSkin))
    }

    const changeLanguageRedux = (language) => {
        dispatch(changeLanguageApp(language))
    }

    return { skin, language, changeSkinRedux, changeLanguageRedux };
}

export default useSkin;
