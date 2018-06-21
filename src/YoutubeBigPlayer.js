import React, { Component } from 'react';
import YouTube from 'react-youtube';

export default class YoutubeBigPlayer extends Component {

  constructor(props){
    super(props);
    this.escFunction = this.escFunction.bind(this);
  }

  opts =
  {
    playerVars: {
      autoplay: 1,
      rel: 0
    }
  }

  escFunction(event) {
    if(event.keyCode === 27) {
      this.props.closeNav()
    }
  }

  componentDidMount(){
    document.addEventListener("keydown", this.escFunction, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.escFunction, false);
  }

  onPlayerStateChange(event) {
     if(event.data === 0) {
         alert('done');
     }
 }

  render() {
    if(this.props.video_object !== undefined && this.props.video_object.video_id !== undefined){
      const video_id = this.props.video_object.video_id;
      console.log("Video_object", this.props.video_object);
      return <div className="overlay"
        id="overlay-player">
        <a className="closebtn" onClick={() => this.props.closeNav()}>&times;</a>
        <YouTube
          className="overlay-content centered"
          id="big_youtube_player"
          videoId={video_id}
          key={video_id}
          opts={this.opts}
          allowFullScreen="allowFullScreen"
          onStateChange={() =>
            this.props.video_object.add_to_watched(video_id)
          }

        />
      </div>
    }
    return <div></div>
  }



}
