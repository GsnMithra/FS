import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const handleGoogleLogin = async () => {
        const response = await fetch(
            "https://fs-aani.onrender.com/authentication/url",
        );
        const urlObject = await response.json();
        const url = urlObject.url;
        window.location.assign(url);
    };

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <div>
            <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
    );
};

export default Login;
