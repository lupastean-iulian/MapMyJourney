import React from "react";
import { Box } from "@mui/material";

export const FullHeightPage: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                padding: 0,
            }}
        >
            {children}
        </Box>
    );
};
