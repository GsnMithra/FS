import { useEffect } from "react";
import CounterContext from "../context/context";
import axios from "axios";
import { useRef } from "react";
import { useContext } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Callback = () => {
    const called = useRef(false);
    const navigate = useNavigate();
    const { state, dispatch } = useContext(CounterContext);
    useEffect(() => {
        (async () => {
            if (called.current) return;
            called.current = true;

            const queryParams = window.location.search;
            const response = await axios.get(
                `https://fs-aani.onrender.com/authentication/token${queryParams}`,
            );

            Cookies.set("token", response.data.token);
            const { name, email, picture } = response.data.user;
            await axios.post("https://fs-aani.onrender.com/user/create", {
                name,
                email,
            });

            if (response.status === 200)
                dispatch({
                    loginState: true,
                    name: name,
                    email: email,
                    picture: picture,
                });

            navigate("/");
        })();
    }, [dispatch, state]);
    return <></>;
};

export default Callback;
