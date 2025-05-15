import { useAuth0 } from "@auth0/auth0-react";
import { LoadingButton } from "@mui/lab"
import { Box } from "@mui/material"

export const LogoutButton: React.FC<React.PropsWithChildren> = () => {
    const { logout } = useAuth0()
    const handleClick = () => {
        logout({ logoutParams: { returnTo: window.location.origin, federated: true } })
    }
    return (
        <Box component="form" noValidate autoComplete="off">
            <Box display="flex" flexDirection="column" alignItems="center">
                <LoadingButton variant="contained" color="primary" size="large" type="submit" loading={false} sx={{ width: '100%', mt: 2 }} onClick={() => handleClick()}>
                    Logout
                </LoadingButton>
            </Box>
        </Box>)
}