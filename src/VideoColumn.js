import React, { Component } from "react";
import VideoThumbnail from "./VideoThumbnail";
import {
  getDataFromYoutube,
  generateJSONRequestForPlaylist,
  generateJSONRequestForChannel,
  generateJSONRequestForUserRecentUploads
} from "./utilities";
import { Row, Col } from "react-bootstrap";
import { List } from "react-virtualized";

export default class VideoColumn extends Component {
  videos_to_request = 50;

  constructor(props) {
    super(props);
    this.state = { content: {} };
    this.getListOfContent(props.source_info);
  }

  render() {
    let column_size = this.props.column_size ? this.props.column_size : 6;

    const content = this.convert_list_of_ids_to_thumbnails(
      this.state.content,
      this.props.add_to_queue,
      this.props.on_click
    );

    const videos = this.state.content.length > 0 ?
        <List
          width={500}
          height={750}
          rowCount={this.state.content.length}
          rowHeight={200}
          rowRenderer={({ key, index, isScrolling, isVisible, style }) =>
            this.rowRenderer({
              key,
              index,
              isScrolling,
              isVisible,
              style,
              content
            })
          }
        />
        : <div></div>

    return (
      <Col sm={column_size}>
        <div>
          <h2>{this.find_column_title()}</h2>
          <a
            onClick={() => {
              this.props.remove_subscription(this.props.content_id);
            }}
          >
            x
          </a>
          {videos}
        </div>
      </Col>
    );
  }

  rowRenderer({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
    content
  }) {
    return (
      <div key={key} style={style}>
        {content[index]}
      </div>
    );
  }

  getListOfContent(source_info) {
    if (source_info.content_type === "channel") {
      getDataFromYoutube(
        generateJSONRequestForChannel(this.props.content_id, this.videos_to_request)
      ).then(data => {
        this.setState({ content: data.items });
      });
    } else if (source_info.content_type === "user") {
      generateJSONRequestForUserRecentUploads(this.props.content_id, this.videos_to_request).then(
        json_request =>
          getDataFromYoutube(json_request, this.videos_to_request).then(data =>
            this.setState({ content: data.items })
          )
      );
    } else if (source_info.content_type === "playlist") {
      getDataFromYoutube(
        generateJSONRequestForPlaylist(this.props.content_id, this.videos_to_request)
      ).then(data => {
        this.setState({ content: data.items });
      });
    }
  }

  find_column_title() {
    if (this.state.content[0] === undefined) {
      return;
    }
    return this.props.source_info.content_type === "playlist"
      ? this.state.content[0].snippet.title
      : this.state.content[0].snippet.channelTitle;
  }

  map_json_response_to_video_object(data_items, add_video_to_list, on_click) {
    let result;
    if (this.props.source_info.content_type === "channel") {
      result = {
        video_id: data_items.id.videoId,
        video_title: data_items.snippet.title,
        video_thumbnail: data_items.snippet.thumbnails.medium.url,
        add_video_to_list: add_video_to_list,
        on_click: on_click,
        type: "video"
      };
    } else {
      result = {
        video_id: data_items.contentDetails.videoId,
        video_title: data_items.snippet.title,
        video_thumbnail: data_items.snippet.thumbnails.medium.url,
        add_video_to_list: add_video_to_list,
        on_click: on_click,
        type: "video"
      };
    }
    return result;
  }

  take_video_object_return_thumbnail(video_object) {
    return (
      <Row key={video_object.video_id}>
        <VideoThumbnail
          video_object={video_object}
          add_video_to_list={video_object.add_video_to_list}
          on_click={video_object.on_click}
        />
      </Row>
    );
  }

  convert_list_of_ids_to_thumbnails(
    playlist_items,
    add_video_to_list,
    on_click
  ) {
    if (playlist_items[0] === undefined) {
      return;
    }
    return playlist_items.map(json_for_me => {
      let video_object = this.map_json_response_to_video_object(
        json_for_me,
        add_video_to_list,
        on_click
      );
      return this.take_video_object_return_thumbnail(video_object);
    });
  }
}
