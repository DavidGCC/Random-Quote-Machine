import React from 'react';
import ReactDOM from 'react-dom';
import axios from "axios";
import randomColor from "randomcolor";
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActions, CardActionArea, CardContent, Button, Typography, CardMedia, Grid, IconButton } from "@material-ui/core";
import TwitterIcon from '@material-ui/icons/Twitter';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles({
    root: {
        width: 450,
        minHeight: 500
    },
    media: {
        width: "100%",
        height: "100%",
    },
    mediaContainer: {
        width: "100%",
        height: 300
    },
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw"
    },
    quoteText: {
        fontSize: "1.2rem"
    },
    quoteAuthor: {
        fontSize: "2rem",
        direction: "rtl"
    },
    cardContent: {
        minHeight: 250,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    tweetQuote: {
        textDecoration: "none",
        color: "#fff"
    }
});

const App = () => {
    const classes = useStyles();
    const [quote, setQuote] = React.useState({});
    const [authorImage, setAuthorImage] = React.useState({});
    const [color, setColor] = React.useState({});


    const getNewQuote = async () => {
        setColor(randomColor());
        setAuthorImage({});
        const response = await axios.get("https://goquotes-api.herokuapp.com/api/v1/random?count=1");
        setQuote(response.data.quotes[0]);
    }

    React.useEffect(() => {
        getNewQuote();
    }, [])
    React.useEffect(() => {
        axios
            .get(`https://en.wikipedia.org/w/api.php?action=query&titles=${quote.author}&prop=pageimages&piprop=original&origin=*&format=json`)
            .then(response => {
                const objectKeys = Object.keys(response.data.query.pages);
                if (response.data.query.pages[objectKeys[0]].original) {
                    setAuthorImage(response.data.query.pages[objectKeys[0]].original);
                } else {
                    setAuthorImage(null)
                }
            })
    }, [quote])
    return (
        <div className={classes.container} style={{ backgroundColor: color }}>
            <Card className={classes.root} id="quote-box">
                <CardActionArea className={classes.cardActionArea}>
                    <div className={classes.mediaContainer}>
                        {authorImage
                            ? <img className={classes.media} src={authorImage?.source} />
                            : <p>No Image Available</p>
                        }
                    </div>
                    <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h5" id="text" className={classes.quoteText}>
                            {quote?.text}
                        </Typography>
                        <Typography gutterBottom variant="body1" component="p" id="author" className={classes.quoteAuthor}>
                            {quote?.author} -
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <Grid container justify="space-between" style={{ marginBottom: 15, marginTop: 15 }}>
                    <Grid item >
                        <a id="tweet-quote" className={classes.tweetQuote} target="_blank" href={`https://twitter.com/intent/tweet?text=${quote.text}%0D- ${quote.author}`} title="Tweet This Quote">
                            <Button color="primary" size="large" variant="contained" style={{ marginLeft: 10 }}>
                                Share <TwitterIcon />
                            </Button>
                        </a>
                    </Grid>
                    <Grid item>
                        <Button id="new-quote" size="large" variant="contained" style={{ marginRight: 10 }} onClick={() => getNewQuote()}>
                            New Quote <NavigateNextIcon />
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        </div>
    );
}


ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);