import { createTheme } from '@mui/material/styles';

// Extend the Palette to include navbar color
declare module '@mui/material/styles' {
    interface Palette {
        navbar: Palette['primary'];
    }
    interface PaletteOptions {
        navbar?: PaletteOptions['primary'];
    }
}

const HEADER_HEIGHT = '7vh';
const FOOTER_HEIGHT = '6vh';

const theme = createTheme({
    palette: {
        navbar: {
            main: '#2d3847',
            contrastText: '#fff',
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    minHeight: HEADER_HEIGHT,
                    height: HEADER_HEIGHT,
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    minHeight: HEADER_HEIGHT,
                    height: HEADER_HEIGHT,
                },
            },
        },
    },
});

export { HEADER_HEIGHT, FOOTER_HEIGHT };
export default theme;
