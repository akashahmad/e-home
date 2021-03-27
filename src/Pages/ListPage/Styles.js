import { makeStyles } from "@material-ui/core";
import inputStyles from "../../assets/styles/inputStyles";

export default makeStyles((theme) => ({
    ...inputStyles,
    specHeadingText: {
        textAlign: "center",
        fontSize: "14px",
        lineHeight: "20px",
        fontWeight: "bold"
    },
    headerText: {
        color: "white",
        textAlign: "center"
    },
    smallText: {
        fontSize: "12px"
    },
    listContainer: {
        margin: "20px 0px 20px 0px"
    }
}));
