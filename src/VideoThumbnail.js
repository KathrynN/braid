import React, { Component } from 'react';
import { Image, Glyphicon } from 'react-bootstrap';
import FlexView from 'react-flexview';

export default class VideoThumbnail extends Component {

  render() {
    const video_object = this.props.video_object;
    const class_name = video_object.watched? "watched" : "";
    return <div className="videothumbnail">
    <FlexView column style={{ height: 175 }}>
    <div>
    {this.generate_watched_link(video_object)}
    </div>
    <div className={class_name}>
      <FlexView shrink height={135}>
        <Image
          src={video_object.video_thumbnail.url}
          alt = {video_object.video_title}
          key = {video_object.video_id}
          onClick={() => {
              video_object.add_to_queue(video_object);
              video_object.on_click(video_object);
            }
          }
        />
        <FlexView column>
         <h5>{video_object.video_title}</h5>
         <p>
          {video_object.video_description.substring(0, 200)} ...
         </p>
         </FlexView>
      </FlexView>
    </div>
    </FlexView></div>
  }

  generate_watched_link(video_object) {
    return video_object.watched
    ? (<Glyphicon
        glyph="eye-close"
        onClick={() => {video_object.remove_from_watched(video_object.video_id)}}
      />)
    : (<Glyphicon
        glyph="eye-open"
        onClick={() => {video_object.add_to_watched(video_object.video_id)}}
      />)
  }
}
