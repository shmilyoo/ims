import { createMuiTheme } from '@material-ui/core/styles';

// A theme with custom primary and secondary color.
// It's optional.

const primaryTextColor = 'rgba(0, 0, 0, 0.87)';
const secondaryTextColor = 'rgba(0, 0, 0, 0.54)';
const thirdTextColor = 'rgba(0, 0, 0, 0.21)';
const error = {
  main: '#EC2935',
  light: '#ff6560',
  dark: '#b1000e',
  contrastText: '#000'
};
const theme = createMuiTheme({
  palette: {
    background: { default: '#eee' },
    secondary: {
      light: '#82e9de',
      main: '#4db6ac',
      dark: '#00867d',
      contrastText: '#000'
    },
    primary: {
      main: '#6657F8',
      light: '#9f85ff',
      dark: '#1d2cc4',
      contrastText: '#FFF'
    },
    info: {
      light: '#9fc8ff',
      main: '#6a98e9',
      dark: '#316ab6',
      contrastText: '#000'
    },
    warn: {
      main: '#F5C900',
      light: '#fffc50',
      dark: '#be9900',
      contrastText: '#000'
    },
    error: error,
    text: {
      primary: primaryTextColor,
      secondary: secondaryTextColor,
      third: thirdTextColor // 用来表格间隔行的backgroundColor
    }
  },
  typography: {
    useNextVariants: true,
    // Tell Material-UI what's the font-size on the html element is.
    htmlFontSize: 10,
    fontSize: 14,
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    title2: {
      fontSize: '2rem'
    },
    title3: {
      fontSize: '3rem',
      margin: '2rem 0'
    },
    title4: {
      fontSize: '4rem'
    }
  },
  sharedClass: {
    link: {
      // fontSize: '1.4rem',
      cursor: 'pointer',
      color: primaryTextColor,
      textDecoration: 'none',
      '&:visited': { color: secondaryTextColor },
      '&:hover': { textDecoration: 'underline' }
    },
    disableLink: {
      // fontSize: '1.4rem',
      cursor: 'default',
      color: secondaryTextColor
      // '&:hover': { textDecoration: 'line-through' }
    },
    grayLink: {
      // fontSize: '1.4rem',
      cursor: 'pointer',
      color: secondaryTextColor,
      textDecoration: 'none',
      '&:visited': { color: secondaryTextColor },
      '&:hover': { textDecoration: 'underline' }
    },
    onlyLink: {
      // fontSize: '1.4rem',
      cursor: 'pointer',
      '&:hover': { textDecoration: 'underline' }
    },
    alertBtn: {
      // color: error.light,
      '&:hover': { color: error.light }
    },
    lineCut: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }
  }
});

// function themeProvider(Component) {
//   return class extends React.Component {
//     static displayName = 'material-ui-withRoot';
//     // MuiThemeProvider makes the theme available down the React tree
//     // thanks to React context.
//     render() {
//       return (
//         <MuiThemeProvider theme={theme}>
//           {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
//           <CssBaseline />
//           <Component {...this.props} />
//         </MuiThemeProvider>
//       );
//     }
//   };
// }
// themeProvider.displayName =
//   "Hoc to add material-ui's MthemeProvider and CssBaseline";

export default theme;
