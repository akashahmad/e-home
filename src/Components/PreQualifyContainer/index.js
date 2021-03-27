import React, { Component } from "react";
import { Grid, Typography, Box } from "@material-ui/core";
import useStyles from "./Styles";
import { Button } from "reactstrap";

function PreQualifyContainer(props) {
    const classes = useStyles();
    const onCardClick = () => {
        //   console.log('props.propertyValues.id', props.propertyValues.id);
        //   let url = "/property-view?id=" + props.propertyValues.id
        //     props.history.push({
        //         pathname: "/property-view",
        //         state: { id: props.propertyValues.id}
        //     });
    };

    return (
        <Box
            boxShadow={3}
            container
            style={{
                width: "100%",
                marginBottom: "10px",
                alignSelf: "center"
            }}
            onClick={onCardClick}
        >
            <Grid container className={classes.imageContainer}>
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "black"
                    }}
                >
                    <img
                        alt="..."
                        style={{
                            resize: "contain",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "black",
                            opacity: "0.6"
                        }}
                        src={require("../../assets/images/propertyHouse.jpg")}
                    />
                </div>

                <Grid
                    container
                    direction="column"
                    className={classes.salePriceContainer}
                >
                    <Grid
                        item
                        style={{ display: "contents" }}
                        alignItems="center"
                        justify="center"
                    >
                        <Typography
                            variant="body3"
                            className={`${classes.headerText} ${classes.boldText}`}
                        >
                            GET PREQUALIFY
                        </Typography>
                        <Grid item>
                            <Typography
                                variant="body3"
                                className={`${classes.headerText}`}
                                gutterBottom
                            >
                                TODAY
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant="body3"
                            className={`${classes.smallText} ${classes.headerText}`}
                            gutterBottom
                        >
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s,
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            className={classes.buttonStyle}
                            color="secondary"
                            variant="contained"
                        >
                            Get Prequalify
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default PreQualifyContainer;
