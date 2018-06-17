import React, { Component } from 'react';
import { Image } from 'react-bootstrap';

export default class VideoThumbnail extends Component {

  render() {
    const video_object = this.props.video_object;
    return <div>
      <Image thumbnail
        src={video_object.video_thumbnail}
        alt = {video_object.video_title}
        key = {video_object.video_id}
        onClick={() => {
            this.props.add_video_to_list(video_object);
            this.props.on_click(video_object);
          }
        }
      />
    </div>
  }


}
