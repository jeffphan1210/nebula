import {CardHeader} from "@material-ui/core";
import * as React from "react";
import {Group, Info, QuestionAnswer} from "@material-ui/icons"
import Link from "@material-ui/core/Link";
import Creators from "./Creators";

function About(props) {
    return <React.Fragment>
        <CardHeader
            title={"What is Nebula?"}
            subheader={"Nebula provides real-time glimpse into the current state of the " +
            "libraries online access systems."}
            avatar={<QuestionAnswer/>}
        />
        <CardHeader
            title={"What do the cards mean?"}
            subheader={"Each card here represents a book someone (or a few people) have " +
            "clicked on to read more about in the library search system"}
            avatar={<QuestionAnswer/>}

        />
        <CardHeader
            title={"About the creators"}
            avatar={<Group/>}
            subheader={<Creators/>}
        />
        <CardHeader
            title={"Inspiration"}
            avatar={<Info/>}

            subheader={
                <>
                    This project was inspired by and borrows heavily from Unstacked at NSW Library.
                    <Link href="https://unstacked.dxlab.sl.nsw.gov.au/" target="_blank"
                          rel="noopener noreferrer" color={"inherit"}>
                        "Unstacked NSW"
                    </Link> by <Link href="http://adamhinshaw.com/" target="_blank"
                                     rel="noopener noreferrer" color={"inherit"}>
                    Adam Hinshaw
                </Link> and <Link href="http://elisalee.net/" target="_blank"
                                  rel="noopener noreferrer" color={"inherit"}>
                    Elisa Lee
                </Link>, <Link href="https://github.com/slnsw" target="_blank"
                               rel="noopener noreferrer" color={"inherit"}>
                    NSW Library
                </Link> is in the <Link href="http://creativecommons.org/publicdomain/zero/1.0/"
                                        target="_blank"
                                        rel="noopener noreferrer" color={"inherit"}>
                    Public Domain, CC0
                </Link>
                </>
            }
        />
    </React.Fragment>
}

About.propTypes = {};

About.defaultProps = {};

export default About