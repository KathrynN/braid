import React, { Component } from "react";
import VideoThumbnail from "./VideoThumbnail";
import { Glyphicon } from "react-bootstrap";
import {
  getDataFromYoutube,
  is_video_watched,
  retrieve_from_local_storage,
  generateJSONRequestForPlaylist,
  generateJSONRequestForChannel,
  generateJSONRequestForUserRecentUploads
} from "./utilities";
import { List } from "react-virtualized";
import FlexView from "react-flexview";

export default class VideoColumn extends Component {
  videos_to_request = 50;
  can_request_more = true;

  constructor(props) {
    super(props);
    this.state = { content: [], height: 0 };
    this.getListOfContent(props.source_info);
  }

  componentDidMount() {
    this.setHeightIntoState();
    window.addEventListener("resize", () => this.setHeightIntoState())
  }

  setHeightIntoState() {
    this.setState({
      height: window.innerHeight - 200
    })
  }

  render() {
    let videos;
    if (this.state.content.length > 0) {
      let content = this.state.content;

      const contentVideoComponents = this.convert_list_of_ids_to_thumbnails(
        content
      );
      videos = (
        <List
          width={500}
          height={this.state.height}
          rowCount={contentVideoComponents.length}
          rowHeight={150}
          rowRenderer={({ key, index, isScrolling, isVisible, style }) =>
            this.rowRenderer({
              key,
              index,
              isScrolling,
              isVisible,
              style,
              contentVideoComponents
            })
          }
          onRowsRendered={
            ({ stopIndex }) =>{
            if (content.length - stopIndex < 5 && this.can_request_more) {
              this.getMoreVideos();
            }}
          }
        />
      );
    } else {
      videos = <div />;
    }

    return (
      <FlexView column>
        <h2>{this.find_column_title()}</h2>
        <FlexView hAlignContent='right' >
        <Glyphicon
          glyph="remove"
          className="clickable"
          onClick={() => {
            this.props.remove_subscription(this.props.content_id);
          }}
        />
        <Glyphicon
          glyph="eject"
          className="clickable"
          onClick={() => {
            this.mark_all_as_watched();
          }}
        />
        </FlexView>
        {videos}
      </FlexView>
    );
  }

  mark_all_as_watched(){
    this.props.add_all_to_watched(this.state.content.map(x=>x.snippet.resourceId.videoId));
    }

  rowRenderer({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
    contentVideoComponents
  }) {

    return (
      <div key={key} style={style}>
        {contentVideoComponents[index]}
      </div>
    );
  }

  getMoreVideos() {
    this.can_request_more = false;
    const token = this.state.nextPageToken;
    this.getListOfContent(this.props.source_info, token);
  }

  getListOfContent(source_info, source_token_id) {
    const source_token_request =
      source_token_id !== undefined ? "&pageToken=" + source_token_id : "";
    if (source_info.content_type === "channel") {
      getDataFromYoutube(
        generateJSONRequestForChannel(
          this.props.content_id,
          this.videos_to_request
        ) + source_token_request
      ).then(data => {
        let content_of_column = this.state.content.slice().concat(data.items);
        this.setState({
          content: content_of_column,
          nextPageToken: data.nextPageToken
        });
        this.can_request_more = true;
      });
    } else if (source_info.content_type === "user") {
      generateJSONRequestForUserRecentUploads(
        this.props.content_id,
        this.videos_to_request
      ).then(json_request => {
        if (json_request === "user has no videos") {
          this.props.remove_subscription(this.props.content_id);
        } else {
          getDataFromYoutube(
            json_request + source_token_request,
            this.videos_to_request
          ).then(data => {
            let content_of_column = this.state.content
              .slice()
              .concat(data.items);
            this.setState({
              content: content_of_column,
              nextPageToken: data.nextPageToken
            });
            this.can_request_more = true;
          });
        }
      });
    } else if (source_info.content_type === "playlist") {
      getDataFromYoutube(
        generateJSONRequestForPlaylist(
          this.props.content_id,
          this.videos_to_request
        )
      ).then(data => {
        let content_of_column = this.state.content.slice().concat(data.items);
        this.setState({
          content: content_of_column,
          nextPageToken: data.nextPageToken
        });
        this.can_request_more = true;
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

  map_json_response_to_video_object(data_items) {
    let result = {
      video_title: data_items.snippet.title,
      video_thumbnail: data_items.snippet.thumbnails.medium,
      video_description: data_items.snippet.description,
      add_to_queue: this.props.add_to_queue,
      add_to_watched: this.props.add_to_watched,
      remove_from_watched: this.props.remove_from_watched,
      on_click: this.props.on_click,
      type: "video"
    };
    result.video_id = this.get_video_id(data_items);
    result.watched = is_video_watched(result.video_id);
    return result;
  }

  get_video_id(json_data) {
    if (this.props.source_info.content_type === "channel") {
      return json_data.id.videoId;
    } else {
      return json_data.contentDetails.videoId;
    }
  }

  take_video_object_return_thumbnail(video_object) {
    return <VideoThumbnail video_object={video_object} />;
  }

  convert_list_of_ids_to_thumbnails(playlist_items) {
    if (playlist_items[0] === undefined) {
      return;
    }
    let content = playlist_items;
    if (retrieve_from_local_storage("hide_watched") === true) {
      content = content.filter(e => {
        return !is_video_watched(this.get_video_id(e));
      });
    }
    return content.map(json_for_me => {
      let video_object = this.map_json_response_to_video_object(json_for_me);
      return this.take_video_object_return_thumbnail(video_object);
    });
  }
}
