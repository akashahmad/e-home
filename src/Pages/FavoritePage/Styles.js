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
    image: {
        backgroundImage:
            "url(https://www.zameen.com/assets/imageBackgroundLarge.26028941a74f683ea313d22c00b78929.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundColor: "black",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "40vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)"
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
