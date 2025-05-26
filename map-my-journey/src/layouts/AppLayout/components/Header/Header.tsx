import React from "react";
import {
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    useMediaQuery,
    useTheme,
    Menu,
    MenuItem
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from "../LoginButton/LoginButton";
import { LogoutButton } from "../LogoutButton/LogoutButton";
import { Link as RouterLink } from "react-router-dom";

export const Header: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { isAuthenticated, isLoading } = useAuth0();

    // mobile menu state
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <MuiAppBar
            sx={{
                backgroundColor: theme.palette.navbar.main,
                justifyContent: "center",
                height: "100%",
            }}
            position="static"
            elevation={1}
        >
            <Toolbar sx={{ height: "100%", px: { xs: 2, sm: 3, md: 5 } }}>
                <Button color="inherit" component={RouterLink} to="/">
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                        }}
                    >
                        MapMyJourney
                    </Typography>
                </Button>

                <Box sx={{ flexGrow: 1 }} />

                {/* Desktop Nav */}
                {!isMobile && (
                    <Box display="flex" alignItems="center" gap={3}>
                        {isLoading ? null : isAuthenticated ? (
                            <>
                                <Button color="inherit" component={RouterLink} to="/new">
                                    New
                                </Button>
                                <Button color="inherit" component={RouterLink} to="/view-all">
                                    View All
                                </Button>
                                <LogoutButton />
                            </>
                        ) : (
                            <LoginButton />
                        )}
                    </Box>
                )}

                {/* Mobile Nav Menu */}
                {isMobile && (
                    <>
                        <IconButton
                            color="inherit"
                            onClick={handleMenu}
                            edge="end"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                        >
                            {isLoading ? null : isAuthenticated ? (
                                <>
                                    <MenuItem
                                        component={RouterLink}
                                        to="/new"
                                        onClick={handleClose}
                                    >
                                        New
                                    </MenuItem>
                                    <MenuItem
                                        component={RouterLink}
                                        to="/view-all"
                                        onClick={handleClose}
                                    >
                                        View All
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        <LogoutButton />
                                    </MenuItem>
                                </>
                            ) : (
                                <MenuItem onClick={handleClose}>
                                    <LoginButton />
                                </MenuItem>
                            )}
                        </Menu>
                    </>
                )}
            </Toolbar>
        </MuiAppBar>
    );
};
