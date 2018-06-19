import React, { Component } from 'react';
import { Media } from 'react-bootstrap';
import {retrieve_from_local_storage} from './utilities';

export default class VideoThumbnail extends Component {

  render() {
    const video_object = this.props.video_object;
    const class_name = this.is_video_watched(video_object.video_id)? "watched" : "";
    return <div className={class_name}>
    <Media>
      <Media.Left align="middle">
      <img
        src={video_object.video_thumbnail.url}
        width={video_object.video_thumbnail.width/2}
        alt = {video_object.video_title}
        key = {video_object.video_id}
        onClick={() => {
            this.props.add_video_to_list(video_object);
            this.props.on_click(video_object);
          }
        }
      />
      </Media.Left>
      <Media.Body>
      <a onClick={() => {this.props.add_to_watched(video_object.video_id)}}>add to watched</a>
       <Media.Heading>{video_object.video_title}}</Media.Heading>
       <p>
        {video_object.video_description.substring(0, 200)} ...
       </p>
     </Media.Body>
    </Media>
    </div>
  }

  is_video_watched (video_id) {
    const watched_videos = retrieve_from_local_storage("watched");
    return watched_videos.includes(video_id);
  }


}
