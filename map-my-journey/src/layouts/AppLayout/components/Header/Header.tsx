import React from "react";
import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from "../LoginButton/LoginButton";
import { LogoutButton } from "../LogoutButton/LogoutButton";
import { Link as RouterLink } from 'react-router-dom';
import { HEADER_HEIGHT } from '../../../../theme';

export const Header: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth0();
    const theme = useTheme();
    return (
        <AppBar position="static" sx={{ backgroundColor: theme.palette.navbar.main, minHeight: HEADER_HEIGHT, height: HEADER_HEIGHT, display: 'flex', justifyContent: 'center' }}>
            <Toolbar sx={{ minHeight: HEADER_HEIGHT, height: HEADER_HEIGHT }}>
                <Button color="inherit" component={RouterLink} to="/">
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        MapMyJourney
                    </Typography>
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Box display="flex" alignItems="center" gap={5}>
                    {isLoading ? null : isAuthenticated ? (
                        <>
                            <Button color="inherit" component={RouterLink} to="/new">New</Button>
                            <Button color="inherit" component={RouterLink} to="/view-all">View All</Button>
                            <LogoutButton />
                        </>
                    ) : (
                        <LoginButton />
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};