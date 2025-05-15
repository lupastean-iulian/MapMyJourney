import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useMemo } from "react";

export const useAuthAxios = () => {
    const { getAccessTokenSilently } = useAuth0();

    const axiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: "http://localhost:5026/api",
        });

        instance.interceptors.request.use(async (config) => {
            const token = await getAccessTokenSilently();
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        });

        return instance;
    }, [getAccessTokenSilently]);

    return axiosInstance;
};
