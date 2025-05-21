import { Suspense } from "react";
import { AppLayout } from "../layouts/AppLayout";
import { Box, CircularProgress } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { WelcomePage } from "../modules/welcome/pages/Welcome";
import { useAuth0 } from "@auth0/auth0-react";
import { CreateItinerary } from "@app/modules/CreateItinerary/pages/CreateItinerary";
import { ViewAllItineraries } from "@app/modules/ViewAllItineraries/pages/ViewAllItineraries";

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
        </Routes>
    )
}

function LoggedInRoutes() {
    return (
        <Routes>
            <Route index element={<AppShell> <WelcomePage /> </AppShell>} />
            <Route path="/new" element={<AppShell> <CreateItinerary /> </AppShell>} />
            <Route path="/view-all" element={<AppShell> <ViewAllItineraries /> </AppShell>} />

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