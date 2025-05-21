import React from "react";
import { Box } from "@mui/material";

export const FullHeightPage: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Box
            sx={{
                width: '100%',
                height: '87vh',
                minHeight: 0,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
            }}
        >
            {children}
        </Box>
    );
};
