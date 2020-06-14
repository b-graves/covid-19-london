import React, { Component } from 'react'

import { TwitterTweetEmbed } from 'react-twitter-embed';

//@DHSCgovuk, @10DowningStreet, @NHS24, @healthdpt, @CMO_England, @BorisJohnson, @MattHancock, @NHSEngland, @BBCNews, @BBCWorld, @BBCLondonNews, @SkyNews, @WHO


export class Timeline extends Component {
    render() {
        const { keyDates } = this.props;
        return (
            <div>
                {keyDates.map(date =>
                    <div>
                        <div>
                            {date.name}
                        </div>
                        <TwitterTweetEmbed
                            tweetId={date.tweetId}
                        />
                    </div>
                )}
            </div>
        )
    }
}

export default Timeline
