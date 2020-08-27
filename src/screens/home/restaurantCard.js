import React from 'react';
import "./Home.css";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import StarIcon from '@material-ui/icons/Star';
import ButtonBase from "@material-ui/core/ButtonBase";
import CircularProgress from '@material-ui/core/CircularProgress';


const useStyles = makeStyles({
    root: {
        width: 300,
        margin: 5,
        borderRadius: 5
    },
    media: {
        height: 140,
    },
    ratingText: {
        backgroundColor: "gold",
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        width: '40%',
        float: 'left',
        paddingBottom: '0.1rem',
        paddingTop: '0.1rem'
    },
    textPosition: {
        textAlign: "left"
    },
    averagePriceText: {
        color: 'black',
        width: '40%',
        float: 'right',
        paddingTop: '0.3rem'
    }
});

export default function RestaurantCard(props) {
    const classes = useStyles();
    // redirect to the selected restaurant Id
    function handleClickCardEvent(e) {
        props.history.push('/restaurant/' + e.currentTarget.id);
    }
    return (
        <Grid container direction="row" justify="flex-start" alignItems="center" >
            {props.restaurantData && props.restaurantData.length > 0 ?
                props.restaurantData.map((restObj, index) => (
                    <Grid key={index}>
                        <ButtonBase id={restObj.id} onClick={handleClickCardEvent}>
                            <Card className={classes.root} >
                                <CardActionArea>
                                    <CardMedia
                                        className={classes.media}
                                        image={restObj.photo_URL}
                                        title={restObj.restaurant_name}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2" style={{ textAlign: "left" }}>
                                            {restObj.restaurant_name}
                                        </Typography>
                                        <div style={{ height: '1rem' }} />
                                        <Typography variant="body2" color="textSecondary" component="p" style={{ textAlign: "left" }}>
                                            {restObj.categories}
                                        </Typography>
                                        <div style={{ height: '1rem' }} />

                                        <p variant="display1" className={classes.ratingText} component="span" >
                                            <StarIcon /> &nbsp;{Math.round(restObj.customer_rating * 10) / 10}({restObj.number_customers_rated})
                                    </p>
                                        <Typography variant="caption" color="textPrimary" className={classes.averagePriceText} component="span">
                                            &#8377;{restObj.average_price} for two
                            </Typography>
                                        <br />
                                        <br />
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </ButtonBase>
                    </Grid>
                )) : <div class='progress-bar'>
            <CircularProgress />
          </div>
         }
        </Grid>
    );
}
