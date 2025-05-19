import { Box } from "@mui/material";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
type LayoutProps = {
    children: React.ReactNode;
}

export const AppLayout: React.FC<React.PropsWithChildren<LayoutProps>> = ({ children }) => {
    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Header />
            <Box component="main" flex={1}>{children}</Box>
            <Footer />
        </Box>
    )
}