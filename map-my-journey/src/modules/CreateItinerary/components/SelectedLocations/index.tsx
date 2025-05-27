import { Container, Accordion, AccordionSummary, AccordionDetails, Typography, Box, Button } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useCreateItineraryContext } from "../../context/useCreateItineraryContext";

export const SelectedLocations: React.FC = () => {
    const { selectedLocations, markersCache, setSelectedLocations } = useCreateItineraryContext();
    const handleClearAll = () => {
        setSelectedLocations([]); // Clear all selected locations
        markersCache.clear(); // Clear the markers cache
    }
    return (
        <Container sx={{
            maxHeight: { xs: 'none', md: 500 },
            overflow: { xs: 'visible', md: 'hidden' },
            p: 2,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box display='flex' justifyContent={'space-between'} alignItems='center' mb={2} flexShrink={0}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Selected Locations
                </Typography>
                <Button onClick={handleClearAll} variant="outlined" color="error" sx={{ mb: 2 }}>
                    Clear All
                </Button>
            </Box>
            <Box sx={{ flex: 1, overflowY: { xs: 'visible', md: 'auto' } }}>
                {selectedLocations.length > 0 ? (

                    <Box>
                        {selectedLocations.map((location) => (
                            <Accordion key={location.place_id} sx={{
                                border: '2px solid',
                                borderColor: 'primary.light',
                                borderRadius: 2,
                                boxShadow: 3,
                                mb: 2,
                                '&:before': { display: 'none' },
                                transition: 'box-shadow 0.2s',
                                cursor: 'pointer',
                                backgroundColor: 'background.paper',
                                '&:hover': {
                                    boxShadow: 6,
                                    borderColor: 'primary.main',
                                },
                            }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography fontWeight={600} sx={{ flex: 1 }}>{location.name || 'Unknown Place'}</Typography>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        sx={{ ml: 2 }}
                                        onClick={e => {
                                            e.stopPropagation();
                                            setSelectedLocations(selectedLocations.filter(l => l.place_id !== location.place_id));
                                            if (markersCache.has(location.place_id)) {
                                                const markerObj = markersCache.get(location.place_id);
                                                markerObj?.marker && (markerObj.marker.map = null);
                                                markersCache.delete(location.place_id);
                                            }
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2" color="text.secondary">
                                        Address: {location.formatted_address || 'No address available'}
                                    </Typography>
                                    {location.website && (
                                        <Typography variant="body2" sx={{ mt: 1, color: 'primary.main', fontWeight: 500 }}>
                                            Website: <a href={location.website} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline' }}>{location.website}</a>
                                        </Typography>
                                    )}
                                    {location.opening_hours && (
                                        <Box mt={1}>
                                            {'open_now' in location.opening_hours && (
                                                <Typography variant="body2" fontWeight={600} color={location.opening_hours.open_now ? 'success.main' : 'error.main'}>
                                                    Currently {location.opening_hours.open_now ? 'Open' : 'Closed'}
                                                </Typography>
                                            )}
                                            {Array.isArray(location.opening_hours.weekday_text) && (
                                                <Box mt={0.5}>
                                                    <Typography variant="body2" fontWeight={500}>Opening Hours:</Typography>
                                                    {location.opening_hours.weekday_text.map((line: string, idx: number) => (
                                                        <Typography key={idx} variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                            {line}
                                                        </Typography>
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                    {location.rating && (
                                        <Typography variant="body2" sx={{ mt: 1, fontWeight: 500, color: 'warning.main' }}>Rating: {location.rating} ⭐</Typography>
                                    )}
                                    {location.international_phone_number && (
                                        <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>Phone: {location.international_phone_number}</Typography>
                                    )}
                                    {/* Add more details as needed */}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                ) : (
                    <Typography>No locations selected yet.</Typography>
                )}
            </Box>
        </Container>
    )
}