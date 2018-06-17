import React, { Component } from 'react';
import YouTube from 'react-youtube';

export default class YoutubeBigPlayer extends Component {
  opts = {
    playerVars: {
      autoplay: 1,
      rel: 0
    }
  }

  render() {
    if(this.props.video_object){
      const video_id = this.props.video_object.video_id;
      return <div className="overlay"
        id="overlay-player">
        <a className="closebtn" onClick={() => this.props.closeNav()}>&times;</a>
        <YouTube
          className="overlay-content"
          videoId={video_id}
          key={video_id}
          opts={this.opts}
          allowFullScreen="allowFullScreen"
        />
      </div>
    }
    return <div></div>
  }



}
