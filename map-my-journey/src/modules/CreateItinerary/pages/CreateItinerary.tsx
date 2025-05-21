import React from "react";
import { Box } from "@mui/material";
import { FullHeightPage } from "@app/layouts/AppLayout/pages/FullHeightPage/FullHeightPage";
import { LocationFilters } from "../components/Filters/LocationFilters";
import { CreateItineraryContextProvider } from "../context/CreateItineraryContext";
import { MapComponent } from "../components/Map/MapComponent";

export const CreateItinerary: React.FC = () => {
    return (
        <FullHeightPage>
            <CreateItineraryContextProvider>
                <Box display="flex" flexDirection="column" height="100%" width="100%">
                    <Box flex="0 0 25%" height="25%" display="flex" alignItems="center" justifyContent="center">
                        <LocationFilters />
                    </Box>
                    <Box flex="0 0 75%" height="75%" display="flex">
                        <Box width="60%" bgcolor="blue" display="flex" alignItems="center" justifyContent="center">
                            <MapComponent />
                        </Box>
                        <Box width="40%" bgcolor="green" display="flex" alignItems="center" justifyContent="center">
                            Selected Locations (40%)
                        </Box>
                    </Box>
                </Box>
            </CreateItineraryContextProvider>
        </FullHeightPage>
    );
};