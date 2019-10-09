import * as React from "react";
import Img from 'react-image'
import CircularProgress from "@material-ui/core/CircularProgress";

import themeData from "../constants/theme"
import CardActionArea from "@material-ui/core/CardActionArea";
import Badge from "@material-ui/core/Badge";
import {Visibility} from "@material-ui/icons";
import {makeStyles, Tooltip} from "@material-ui/core";
import Zoom from "@material-ui/core/Zoom";
import * as PropTypes from "prop-types";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    clickable: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1
    },
    image: {
        width: "100%"
    },
    text: {
        color: "white",
        textAlign: "center",
        padding: `${themeData.cards.gutter}px`,
        width: "calc(100 % -10px);",
        marginTop: "10px"
    },

    tag: {
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "10",
        padding: "2px",
        background: "#00000070",
        borderBottomRightRadius: "5px",
        textTransform: "capitalize",
        color: "white",
    },
    views: {
        position: "absolute",
        top: "0",
        right: "0",
        zIndex: "10",
        margin: theme.spacing(1)
    }
}));


function BookView(props) {
    const classes = useStyles();
    const {book, onClick, images, title, record_type, color, setFilter} = props;

    const loader = <CircularProgress/>;
    const fallback = <div className={classes.text}><h3>{title}</h3></div>;

    const filterByThisRecordType = () => {
        setFilter(`[data-record_type=${record_type}]`);
    };


    return <>
        <Tooltip title={`Filter by ${record_type}`}>
            <Button className={classes.tag} onClick={filterByThisRecordType}>
                {record_type}
            </Button>
        </Tooltip>
        <CardActionArea onClick={onClick} className={classes.clickable} style={{background: color}}>

            <Img src={images} alt={""} className={classes.image} loader={loader}
                 unloader={fallback}
                 container={(c) => <Zoom mountOnEnter={true} in={true} appear={true} timeout={1000}>{c}</Zoom>}
            />

            <div className={classes.views}>
                {book.count > 1 &&
                <Badge badgeContent={book.count} overlap={"circle"} color="primary">
                    <Visibility/>
                </Badge>
                }
            </div>
        </CardActionArea>
    </>

}

BookView.propTypes = {
    book: PropTypes.object.isRequired,

    onClick: PropTypes.func.isRequired,
    setFilter: PropTypes.func,
    setSort: PropTypes.func,

    images: PropTypes.array,
    title: PropTypes.string,
    record_type: PropTypes.string,
    color: PropTypes.string
};

BookView.defaultProps = {
    setFilter: () => {
    },
    setSort: () => {
    }
};

export default BookView