import { useAuth0 } from "@auth0/auth0-react";
import { useMsal } from "@azure/msal-react";
import { LoadingButton } from "@mui/lab"
import { Box, TextField } from "@mui/material"

export const LoginButton: React.FC<React.PropsWithChildren> = () => {
    const { loginWithRedirect } = useAuth0()
    const handleClick = () => {
        loginWithRedirect({
            authorizationParams: {
                max_age: 0
            }
        })
    }
    return (
        <Box component="form" noValidate autoComplete="off">
            <Box display="flex" flexDirection="column" alignItems="center">
                <LoadingButton variant="contained" color="primary" size="large" type="submit" loading={false} sx={{ width: '100%', mt: 2 }} onClick={() => handleClick()}>
                    Login
                </LoadingButton>
            </Box>
        </Box>)
}