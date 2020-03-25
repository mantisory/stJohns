import React, { useEffect, useState } from "react";
import { Link, useLocation, Redirect } from "react-router-dom";
import dataMethods from "../utils/data";
import { makeStyles, withTheme, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    emailValidated: {
        display: "block",
        textDecoration: "none",
        color: theme.palette.primary.contrastText,
        fontWeight: "bold"
    },
    emailUnvalidated: { display: "none" },
    content: {
        margin: "0 auto",
        paddingTop: 150,
        position: "relative"
    }
}));

function Validate(props) {
    const [emailValidated, setEmailValidated] = useState(false);
    const [error, setError] = useState(null);
    const [updated, setUpdated] = useState(0);

    const classes = useStyles();
    let params = new URLSearchParams(useLocation().search);
    const reset = params.reset
    const payload = {
        email: params.get("email"),
        verificationCode: params.get("code")
    };
    // useEffect(() => {
    //     setUpdated(1)
    // },[]);

    if (updated == 0 && payload.email && payload.verificationCode) {
        dataMethods.emailValidate(payload).then(result => {
            let resultCode = JSON.parse(result.data).data
            if (resultCode === 200) {
                setEmailValidated(true);
            } else if (resultCode == 300) {
                setError(result.data.error)
            }
        });
    }else{
        return <Redirect to="/" push={true}/>
    }

   
    return (

        <div className={classes.content}>
            {emailValidated &&
                <Grid>
                    <Grid item xs={12}>
                        <Typography className={classes.instructions}>
                            Your email has now been validated.
           </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {reset &&
                            <Link to="/PasswordReset.js" className={classes.emailValidated}>
                                Click here to set your password.
                            </Link>
                        }
                        {
                            !reset &&
                            <Link to="/LoginForm" className={classes.emailValidated} >
                                Click here to log in.
                            </Link>
                        }

                    </Grid>
                </Grid>
            }
            {error &&
                <Grid container>
                    <Grid item>
                        There was an error validating your email: {error}
                    </Grid>
                </Grid>
            }
        </div>
    );
}
export default withTheme(Validate);
