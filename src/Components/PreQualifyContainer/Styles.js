import { makeStyles } from "@material-ui/core";
import inputStyles from "../../assets/styles/inputStyles";

export default makeStyles((theme) => ({
    ...inputStyles,
    headerText: {
        color: "white",
        textAlign: "center",
        alignItems: "center"
    },
    boldText: {
        fontWeight: "bold"
    },
    smallText: {
        fontSize: "10px",
        lineHeight: "20px"
    },
    saleText: {
        fontSize: "8px",
        lineHeight: "10px",
        color: "white",
        padding: "2px 5px 2px 5px",
        backgroundColor: "black"
    },
    underlineText: {
        textDecoration: "underline",
        marginLeft: "10px",
        fontSize: "14px"
    },
    salePriceContainer: {
        position: "absolute",
        bottom: "0px",
        right: "0px",
        top: "0px",
        left: "0px",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        padding: "10px 10px 5px 10px"
    },
    soldContainer: {
        position: "absolute",
        top: "0px",
        right: "0px",
        padding: "10px 10px 5px 10px"
    },
    saleContainer: {
        backgroundColor: "black"
    },
    heartContainer: {
        position: "absolute",
        bottom: "0px",
        left: "0px",
        padding: "10px 10px 5px 10px"
    },
    imageContainer: {
        width: "100%",
        height: "400px",
        position: "relative"
    },
    marginRight: {
        marginRight: "15px"
    },
    bottomContainer: {
        padding: "5px 10px 5px 10px"
    },
    buttonContainer: {
        width: "inherit"
    },
    separator: {
        height: "1px",
        backgroundColor: "#F59331",
        width: "30%",
        margin: "10px 0px 10px 0px"
    },
    buttonStyle: {
        color: "white",
        borderRadius: "5px",
        padding: "5px 30px 5px 30px",
        fontSize: "10px",
        backgroundColor: "#336699",
        width: "100%",
        margin: "40px 0px 40px 0px"
    }
}));
