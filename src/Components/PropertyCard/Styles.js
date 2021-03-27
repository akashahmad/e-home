import { makeStyles } from "@material-ui/core";
import inputStyles from "../../assets/styles/inputStyles";

export default makeStyles((theme) => ({
    ...inputStyles,
    headerText: {
        color: "white"
    },
    smallText: {
        fontSize: "10px",
        lineHeight: "20px"
    },
    address: {
        fontSize: "10px",
        lineHeight: "20px"
    },
    underlineText: {
        textDecoration: "underline",
        marginLeft: "10px",
        fontSize: "14px"
    },
    salePriceContainer: {
        position: "absolute",
        bottom: "-100px",
        right: "0px",
        padding: "10px 10px 5px 10px"
    },
    heartContainer: {
        position: "absolute",
        bottom: "0px",
        left: "0px",
        padding: "10px 10px 5px 10px"
    },
    imageContainer: {
        width: "100%",
        height: "200px",
        position: "relative"
    },
    marginRight: {
        marginRight: "15px"
    },
    bottomContainer: {
        position: "absolute",
        bottom: "100px",
        right: "0px",
        paddingLeft: "30px"
    },
    bottomContainer2: {
        position: "absolute",
        bottom: "85px",
        right: "0px",
        paddingLeft: "30px"
    },

    buttonStyle: {
        color: "#3379D0",
        border: "1px solid #3379D0",
        backgroundColor: "transparent",
        borderRadius: "15px",
        padding: "5px 10px 5px 10px",
        fontSize: "10px"
    },
    buttonContainer: {
        position: "absolute",
        bottom: "45px",
        right: "0px",
        paddingRight: "20px",
        width: "inherit"
    }
}));
