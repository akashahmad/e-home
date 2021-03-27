const inputStyles = {
    formField: {
        marginBottom: 10,
        width: "100%"
    },
    blackLabel: {
        "& .MuiInputLabel-root": {
            color: "#172128"
        }
    },
    customTextArea: {
        minHeight: 30,
        width: "100%",
        // padding: "20px 16px",
        color: "#172128",
        resize: "none",
        fontFamily: "Poppins",
        // fontSize: 16,
        color: "red",
        border: "1px solid rgba(23, 33, 40, .15)",

        "&::placeholder": {
            color: "red"
        }
    }
};

export default inputStyles;
