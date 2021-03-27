import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    footerColumnList: {
        listStyleType: "none",
        margin: 0,
        padding: 0,
        "& li": {
            marginTop: 24,

            "& a": {
                // fontFamily: 'Open Sans',
                // fontStyle: 'normal',
                // fontWeight: 'normal',
                // fontSize: '14px',
                // lineHeight: '20px',
                // display: 'flex',
                // alignItems: 'center',
                // letterSpacing: '-0.01em',
                // color: '#171717',
                // textDecoration: 'none',
                color: "#fff",
                fontWeight: 400,
                opacity: 0.6,
                textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"
            }
        }
    },
    footer: {
        backgroundColor: theme.palette.dark.main,
        padding: "73px 0"
        // [theme.breakpoints.down("lg")]: {
        //     paddingLeft: 24,
        //     paddingRight: 24
        // },
        // [theme.breakpoints.down("xs")]: {
        //     padding: "114px 40px"
        // }
    },
    footerLogo: {
        display: "block",
        marginBottom: 5,
        [theme.breakpoints.down("sm")]: {
            width: 177
        }
    },
    fotterSocialIcons: {
        marginRight: 5
    },
    footerHeadMrgnBtm: {
        marginBottom: "28px",
        "& > .MuiTypography-h2": {
            fontFamily: "poppins-semibold"
        },
        [theme.breakpoints.down("xs")]: {
            marginTop: 56
        }
    },
    contactInfo: {
        "& > a": {
            color: "#fff",
            opacity: 0.8,
            display: "block",
            marginBottom: 8,
            [theme.breakpoints.down("sm")]: {
                opacity: 0.6
            }
        },
        "& address": {
            fontStyle: "normal",
            color: "#fff",
            opacity: 0.4,
            marginTop: 40
        }
    }
}));

export default useStyles;
