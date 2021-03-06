import React, {Component} from 'react';
import {findNumCards, getQueryStringValue} from "./helpers/utils";
import * as moment from "moment";
import RecordDisplayLayer from "./RecordDisplayLayer";
import * as PropTypes from "prop-types"


class DataLayer extends Component {
    MIN_QUERY_FREQUENCY = 10000;

    static defaultProps = {
        toggleDarkMode: () => {
        }
    };

    static propTypes = {
        toggleDarkMode: PropTypes.func
    };


    constructor(props) {
        super(props);
        this.state = {
            upstream: {
                state: "connecting"
            },
            records: [],
            ...this.getTimeValues(
                getQueryStringValue("start_at", undefined),
                getQueryStringValue("end_at", undefined),
                getQueryStringValue("data_window", 30)
            ),
        };
    }

    getSyncTimeout = (query_frequency) => {
        /* Get the amount of time until the next timeout
        * This function is only used when the sync_key parameter
        * is included in the query string.
        * This parameter can be used to synchronize animations
        * on multiple displays
        * */
        let synchronization_second = getQueryStringValue("sync_key", false);
        if (synchronization_second) {
            try {
                let common_date = moment.unix(synchronization_second);
                let now = moment();

                let delta = now.valueOf() - common_date.valueOf();
                return query_frequency - (delta % query_frequency)
            } catch (e) {
                console.log(e);
            }
        }
        return 0
    };

    componentDidMount() {
        /*
        * Fetch book data of component mount
        */
        let query_frequency = getQueryStringValue("refresh_interval", "0") * 1000;
        query_frequency = Math.max(query_frequency, this.MIN_QUERY_FREQUENCY);

        let timeout = this.getSyncTimeout(query_frequency);


        console.log(`Calculated refresh interval: ${query_frequency} ms,  ${timeout} ms remaining`);

        if (timeout > 3000) {
            console.log("Next timeout exceeds time boundary (> 3000 ms in future), fetching now");
            this.fetchData()
        }

        this.timeout = setTimeout(
            () => {
                console.log(`[${moment().format()}] Kick off synchronization`);
                this.fetchData();
                this.timeout = setInterval(this.fetchData, query_frequency)
            },
            timeout
        );

        const timeUpdateInterval = moment.duration(10, 'seconds');

        this.interval = setInterval(() => {
            this.setState({
                start_at: this.state.start_at ? this.state.start_at.add(timeUpdateInterval) : this.state.start_at,
                end_at: this.state.end_at.add(timeUpdateInterval)
            })
        }, timeUpdateInterval.asMilliseconds())
    }


    componentWillUnmount() {
        /*
        * Clear the refresh interval to prevent crashes
        */
        if (this.timeout) {
            clearTimeout(this.timeout);
            clearInterval(this.timeout);
            clearInterval(this.interval);
        }
    }

    beginRequest = () => {
        /* Set the state at the beginning of a request */
        this.setState({
            upstream: {
                ...this.state.upstream,
                state: "connecting",
            },
        });
    };

    completeRequest = (result) => {
        /* Set the state at the end of a request */
        let update = {
            records: result["_items"] || this.state.records,
            upstream: {
                ...this.state.upstream,
                state: result ? "synced" : "desynced",
                last_attempt: moment(),
            }
        };
        if (result) {
            update.upstream.last_reached = moment()
        }
        this.setState(update);
    };

    getTimeValues = (start_at, end_at, duration) => {
        duration = moment.duration(duration, "m");
        if (!start_at && !end_at) {
            end_at = moment();
        }

        start_at = start_at ? moment(start_at) : undefined;
        end_at = end_at ? moment(end_at) : start_at.clone().add(duration);

        return {start_at, end_at, duration}
    };

    buildTimeFilter = () => {
        let {start_at, end_at, duration} = this.state;

        start_at = start_at === undefined ? end_at.clone().subtract(duration) : start_at;

        let aggregation = {
            "$start": start_at.toISOString(),
            "$end": end_at.toISOString()
        };

        return {
            aggregate: JSON.stringify(aggregation)
        };
    };

    buildRecordRequestURL = (filter) => {
        let protocol = "https:";
        let location = process.env.REACT_APP_API_LOCATION || '/api';
        let host = process.env.REACT_APP_API_HOST || window.location.hostname;
        let max_results = getQueryStringValue("max_results") || findNumCards() * 10;

        const url = new URL(`${protocol}//${host}${location}/views`);

        url.search = new URLSearchParams({
            "max_results": max_results,
            "page": "1",
            "sort": "-last_view",
            ...filter
        });
        return url
    };

    fetchData = () => {
        this.beginRequest();

        const filters = {
            ...this.buildTimeFilter()
        };

        const destination = this.buildRecordRequestURL(filters);

        fetch(destination.toString()).then(
            response => {
                return response.json()
            }
        ).then(this.completeRequest).catch(err => {
            console.log(err);
            this.completeRequest(false)
        });

    };

    setRequestWindow = (int) => {
        this.setState(this.getTimeValues(this.state.start_at, this.state.end_at, int))
    };

    setWindowStart = (time) => {
        this.setState(this.getTimeValues(time, this.state.end_at, this.state.duration))
    };

    setWindowEnd = (time) => {
        console.log(time);
        this.setState(this.getTimeValues(this.state.start_at, time, this.state.duration))
    };

    render() {
        const {records, upstream, end_at, duration} = this.state;
        const {toggleDarkMode} = this.props;
        return <RecordDisplayLayer records={records}
                                   upstream={upstream}
                                   toggleDarkMode={toggleDarkMode}
                                   setRequestWindow={this.setRequestWindow}
                                   setWindowEnd={this.setWindowEnd}
                                   setWindowStart={this.setWindowStart}
                                   windowEnd={end_at}
                                   windowDuration={duration}

        />
    }


}

export default DataLayer
