import React from "react";
import { Box, Container, Grid } from "@mui/material";
import { FullHeightPage } from "@app/layouts/AppLayout/pages/FullHeightPage/FullHeightPage";
import { CreateItineraryContextProvider } from "../context/CreateItineraryContext";
import { MapComponent } from "../components/Map/MapComponent";
import { SearchComponent } from "../components/Search";
import { CityFilters } from "../components/Filters/CityFilters";
import { CountryFilters } from "../components/Filters/CountryFilters";
import { PlaceInfoDialog } from "../components/PlaceInfoDialog";
import { SelectedLocations } from "../components/SelectedLocations";

export const CreateItinerary: React.FC = () => {
    return (
        <FullHeightPage>
            <CreateItineraryContextProvider>
                <Grid container spacing={2} display='flex' flexDirection='column' width='100%'>
                    <Grid data-testId='filters' sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        width: '100%',
                    }}>
                        <Container
                            sx={{
                                width: { xs: '100%', md: '50%' },
                                padding: 2,
                            }}
                        >
                            <SearchComponent />
                        </Container>
                        <Container
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                padding: 2,
                                width: { xs: '100%', md: '50%' },
                                gap: 2,
                            }}

                        >
                            <CountryFilters />
                            <CityFilters />
                        </Container>
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
                        }}>
                            <SelectedLocations />
                        </Grid>
                    </Grid>
                </Grid>
            </CreateItineraryContextProvider>
        </FullHeightPage >
    );
};