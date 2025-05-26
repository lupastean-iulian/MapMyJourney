import { Box } from "@mui/material";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";

type LayoutProps = {
    children: React.ReactNode;
};

export const AppLayout: React.FC<React.PropsWithChildren<LayoutProps>> = ({ children }) => {
    return (
        <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ height: '8dvh', flexShrink: 0 }}>
                <Header />
            </Box>

            <Box component="main" sx={{ height: '84dvh', overflowY: 'auto', overflowX: 'hidden' }}>
                {children}
            </Box>

            <Box sx={{ height: '8dvh', flexShrink: 0 }}>
                <Footer />
            </Box>
        </Box>
    );
};
