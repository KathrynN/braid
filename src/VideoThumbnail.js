import React, { Component } from 'react';
import { Media } from 'react-bootstrap';

export default class VideoThumbnail extends Component {

  render() {
    const video_object = this.props.video_object;
    return <Media>
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
       <Media.Heading>{video_object.video_title}}</Media.Heading>
       <p>
        {video_object.video_description.substring(0, 200)} ...
       </p>
     </Media.Body>
    </Media>
  }


}
