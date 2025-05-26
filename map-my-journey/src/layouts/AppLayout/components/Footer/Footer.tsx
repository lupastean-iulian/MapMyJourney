import React from "react";
import { Box } from "@mui/material";
import { useTheme } from '@mui/material/styles';

export const Footer: React.FC = () => {
    const theme = useTheme();
    return (
        <Box sx={{ width: '100%', height: '100%', backgroundColor: theme.palette.navbar.main }} />
    );
};
