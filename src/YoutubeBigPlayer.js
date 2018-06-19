import React, { Component } from 'react';
import YouTube from 'react-youtube';

export default class YoutubeBigPlayer extends Component {

  constructor(props){
    super(props);
    this.escFunction = this.escFunction.bind(this);
  }

  opts = {
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
