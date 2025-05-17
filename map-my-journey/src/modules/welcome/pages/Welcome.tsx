import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button } from "@mui/material";
import { useAuthAxios } from "../../../hooks/useAuthAxios";

export const WelcomePage: React.FC<React.PropsWithChildren> = () => {
    const { isAuthenticated } = useAuth0();
    const axiosAuth = useAuthAxios();
    const handleClick = async () => {

        const response = await axiosAuth.get('/Profile')
    }
    return (
        <Box>
            <h1>Welcome to Map My Journey</h1>
            <p>We are glad to have you here!</p>
            <p>Explore the world of travel and adventure.</p>
            {
                isAuthenticated ? (
                    <Button onClick={() => handleClick()}>
                        Test button
                    </Button>)
                    : null
            }
        </Box>
    )
}