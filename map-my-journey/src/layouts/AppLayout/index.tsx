import { useAuth0 } from "@auth0/auth0-react";
import { Box } from "@mui/material";
import { LogoutButton } from "../../modules/logout/components/LogoutButton/LogoutButton";
import { LoginButton } from "../../modules/login/components/LoginButton/LoginButton";
type LayoutProps = {
    children: React.ReactNode;
}

export const AppLayout: React.FC<React.PropsWithChildren<LayoutProps>> = ({ children }) => {
    const { isAuthenticated } = useAuth0();
    return (
        <Box display="flex" flexDirection="column" flex={1}>
            <h1>Navbar</h1>
            {
                isAuthenticated ? <LogoutButton /> : <LoginButton />
            }
            <Box component="main" flex={1} >{children}</Box>
            <h1>Footer</h1>
        </Box>
    )
}