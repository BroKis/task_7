import {useEffect, useState} from "react";
import {AuthService} from "../../../services/AuthService";
import {Navigate} from "react-router-dom";

export const Auth = ({children, redirect = true}) => {
    const [status, setStatus] = useState();
    useEffect(() => {
        (async () => {
            const response = await AuthService.checkAuth()
            setStatus(response?.status)
        })()
    }, []);

    if (status === 200)
        return children;
    else if (status === 401 && redirect)
        return <Navigate to="/login"/>
    else if (status === 401)
        return <></>;
    else if (status === 403)
        return <p>Forbidden</p>

    return <p>Загрузка...</p>
}