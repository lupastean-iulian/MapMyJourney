import { Suspense } from "react";
import { AppLayout } from "../layouts/AppLayout";
import { Box, CircularProgress } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import ForgotPassword from "../modules/forgot-password/pages/ForgotPassword";
import { LoginPage } from "../modules/login/pages/Login";
import { RegistrationPage } from "../modules/registration/pages/Registration/RegistrationPage";
import { WelcomePage } from "../modules/welcome/pages/Welcome";
import { useAuth0 } from "@auth0/auth0-react";

export const AppRoutes = () => {
    const { isAuthenticated } = useAuth0();
    if (isAuthenticated)
        return <LoggedInRoutes />

    return <LoggedOutRoutes />
}

function LoggedOutRoutes() {
    return (
        <Routes>
            <Route index element={<AppShell> <WelcomePage /> </AppShell>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
    )
}

function LoggedInRoutes() {
    return (
        <Routes>
            <Route index element={<AppShell> <WelcomePage /> </AppShell>} />
        </Routes >
    )
}

function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <AppLayout>
            <Suspense fallback={<AppLoading />}>
                {children}
            </Suspense>
        </AppLayout>
    );
}

function AppLoading() {
    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 5,
        }}>
            <CircularProgress size={60} />
        </Box>)
}