import React from "react";
import { Box, Grid } from "@mui/material";
import { FullHeightPage } from "@app/layouts/AppLayout/pages/FullHeightPage/FullHeightPage";
import { LocationFilters } from "../components/Filters/LocationFilters";
import { CreateItineraryContextProvider } from "../context/CreateItineraryContext";
import { MapComponent } from "../components/Map/MapComponent";
import { SearchComponent } from "../components/Search";

export const CreateItinerary: React.FC = () => {
    return (
        <FullHeightPage>
            <CreateItineraryContextProvider>
                <Grid container spacing={2} display='flex' flexDirection='column' width='100%'>
                    <Grid data-testId='filters' sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'stretch',
                        gap: 2,
                        width: '100%',
                        maxWidth: 1400,
                        mx: 'auto',
                        mb: 2,
                        minHeight: { md: 180 }, // set a minHeight for all children at md+
                    }}>
                        <Box sx={{ flex: { xs: 'unset', md: '0 0 50%' }, width: { xs: '100%', md: '50%' }, display: 'flex', justifyContent: 'left', alignItems: 'center', height: '100%' }}>
                            <SearchComponent />
                        </Box>
                        <Box sx={{ flex: { xs: 'unset', md: '0 0 50%' }, width: { xs: '100%', md: '50%' }, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '100%' }}>
                            <LocationFilters />
                        </Box>
                    </Grid>
                    <Grid data-testId='recommandations'>Reccomandations</Grid>
                    <Grid data-testId='content' container>
                        <Grid data-testId='mapComponent' size={{
                            xs: 12, md: 6
                        }}>
                            <MapComponent />
                        </Grid>
                        <Grid data-testId='selectedLocations' size={{
                            xs: 12, md: 6
                        }} bgcolor='green' alignItems='center' justifyContent='center' display='flex'>
                            Selected Locations (40%)
                        </Grid>
                    </Grid>
                </Grid>
            </CreateItineraryContextProvider>
        </FullHeightPage>
    );
};