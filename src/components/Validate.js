import React,{useEffect} from "react";
import { Link, useLocation } from "react-router-dom";
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
  const [emailValidated, setEmailValidated] = React.useState(false);
  const [error, setError] = React.useState(null);
  const[updated, setUpdated]  = React.useState(0)
  const classes = useStyles();
  let params = new URLSearchParams(useLocation().search);

  const payload = {
    email: params.get("email"),
    verificationCode: params.get("code")
  };

if(updated==0){
    dataMethods.emailValidate(payload).then(result => {
        console.log(JSON.parse(result.data))
        let resultCode = JSON.parse(result.data).data
        if (resultCode === 200) {
            // console.log('done')
          setEmailValidated(true);
        }else if(resultCode ==300){
            setError(result.data.error)
        }
      });
    
}
  
  useEffect(() => {
    setUpdated(1)
  })

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
           <Link
             to="/LoginForm"
             className={classes.emailValidated}
           >
             Click here to log in.
           </Link>
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
