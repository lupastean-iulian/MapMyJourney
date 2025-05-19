import { Box } from "@mui/material";

export const WelcomePage: React.FC<React.PropsWithChildren> = () => {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" >
            <h1>Welcome to Map My Journey</h1>
            <p>We are glad to have you here!</p>
            <p>Explore the world of travel and adventure.</p>
        </Box>
    )
}