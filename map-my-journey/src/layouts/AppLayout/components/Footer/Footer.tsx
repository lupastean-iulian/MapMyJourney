import React from "react";
import { Box } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { FOOTER_HEIGHT } from '../../../../theme';

export const Footer: React.FC = () => {
    const theme = useTheme();
    return (
        <Box sx={{ width: '100%', height: FOOTER_HEIGHT, backgroundColor: theme.palette.navbar.main }} />
    );
};
