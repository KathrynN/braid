import React, { Component } from "react";
import "./App.css";
import VideoColumn from "./VideoColumn";
import YoutubeBigPlayer from "./YoutubeBigPlayer";
import { Button, Glyphicon } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { uniq, retrieve_from_local_storage } from "./utilities";
import "bootstrap/dist/css/bootstrap-theme.css";
import "react-flexview/lib/flexView.css";
import FlexView from "react-flexview";

class App extends Component {

  constructor() {
    super();
    this.state = {
      hide_watched: false,
      dark: true
    };
  }

  generate_hide_watched_glyphicon() {
    return retrieve_from_local_storage("hide_watched") === true ? (
      <Glyphicon
        glyph="eye-open"
        onClick={() => {
          this.setHideWatched(false);
        }}
      />
    ) : (
      <Glyphicon
        onClick={() => {
          this.setHideWatched(true);
        }}
        glyph="eye-close"
      />
    );
  }

  generate_dark_mode() {
    const class_name = this.state.dark? "switch_to_light" : "switch_to_dark";
    return (<Glyphicon
      glyph="sunglasses"
      className={class_name}
      onClick={() => {
        this.toggleDarkMode();
      }}
      />)
  }

  toggleDarkMode() {
    const current_state=this.state.dark;
    this.setState({
      dark: !current_state
    });
  }

  setHideWatched(value) {
    this.setState({
      hide_watched: value
    });
    localStorage.setItem("hide_watched", JSON.stringify(value));
  }

  render() {
    const class_name = this.state.dark? "dark App" : "App";
    return (
      <div className={class_name}>
        <header className="App-header">
          <h1 className="App-title">Braid</h1>
          {this.generate_hide_watched_glyphicon()}
          {this.generate_dark_mode()}
        </header>
        <PlaylistForm/>
      </div>
    );
  }
}

class PlaylistForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      new_content: {},
      playlists: [],
      queue: [],
      watched: [],
      error: ""
    };
    this.state.playlists = retrieve_from_local_storage("sources");
    this.state.watched = retrieve_from_local_storage("watched");
  }

  add_to_watched(content_id, video_id) {
    let watched_videos = this.state.watched.slice();
    watched_videos.push(video_id);
    this.setState({
      watched: uniq(watched_videos)
    });
    console.log(video_id)
    localStorage.setItem(
      "watched",
      JSON.stringify(uniq(watched_videos))
    );
  }



  add_all_to_watched(video_ids) {
    let watched_videos = this.state.watched.slice();
    watched_videos = watched_videos.concat(video_ids);
    this.setState({
      watched: uniq(watched_videos)
    });
    localStorage.setItem(
      "watched",
      JSON.stringify(uniq(watched_videos))
    );
  }

  remove_from_watched(video_id) {
    let watched_videos = this.state.watched.slice();
    let update_watched_videos = watched_videos.filter(function(e) {
      return e !== video_id;
    });
    this.setState({
      watched: update_watched_videos
    });
    localStorage.setItem(
      "watched",
      JSON.stringify(uniq(update_watched_videos))
    );
  }

  remove_subscription(source_id) {
    let sources = this.state.playlists.slice();
    let updated_sources = sources.filter(function(e) {
      return e.content_id !== source_id;
    });
    this.setState({
      playlists: updated_sources
    });
    localStorage.setItem("sources", JSON.stringify(updated_sources));
  }

  add_video_to_list(video_object) {
    let list_of_videos = this.state.queue.slice();
    list_of_videos.push(video_object);
    this.setState({ queue: list_of_videos });
  }

  update(e) {
    let input_value = this.refs.inputContentLink.value;
    if (input_value.includes("www.youtube.com")) {
      let url = input_value;
      if (url.includes("playlist")) {
        let playlist_id = url.includes("=")
          ? url.substring(url.lastIndexOf("=") + 1)
          : url;
        this.setState({
          new_content: {
            id: playlist_id,
            type: "playlist"
          }
        });
      } else if (url.includes("channel")) {
        let channel_id = url.includes("videos")
          ? url.substring(url.lastIndexOf("channel") + 8, url.lastIndexOf("/"))
          : url.substring(url.lastIndexOf("/") + 1);
        this.setState({
          new_content: {
            id: channel_id,
            type: "channel"
          }
        });
      } else if (url.includes("user")) {
        let user_id = url.includes("videos")
          ? url.substring(url.lastIndexOf("user") + 5, url.lastIndexOf("/"))
          : url.substring(url.lastIndexOf("/") + 1);
        this.setState({
          new_content: {
            id: user_id,
            type: "user"
          }
        });
      } else {
        this.setState({ new_content: {} });
      }
    } else {
      let user_id = input_value;
      this.setState({
        new_content: {
          id: user_id,
          type: "user"
        }
      });
    }
  }

  play_on_click(video_object) {
    this.setState({
      video_object: video_object
    });
  }

  alert_user(x) {
    this.setState({
      error: x
    })
    setTimeout(() => {
        this.setState({
          error: ""
        })
    }, 5000);
  }

  generateVideoColumns() {
    let videos = [];

    const column_size = 12 / this.state.playlists.length;
    for (let videoID in this.state.playlists) {
      let source_info = this.state.playlists[videoID];
      videos.push(
        <div key={source_info.content_id}>
          <VideoColumn
            source_info={source_info}
            alert_user={x => {
              this.alert_user(x);
            }}
            content_id={source_info.content_id}
            column_size={column_size}
            on_click={x => {
              this.play_on_click(x);
            }}
            remove_subscription={x => this.remove_subscription(x)}
            add_to_queue={x => {
              this.add_video_to_list(x);
            }}
            add_to_watched={x => {
              this.add_to_watched(source_info.content_id, x);
            }}
            remove_from_watched={x => {
              this.remove_from_watched(x);
            }}
            add_all_to_watched={x => {
              this.add_all_to_watched(x);
            }}
          />
        </div>
      );
    }
    return videos;
  }

  closeNav() {
    this.setState({ video_object: {} });
  }

  render() {
    return (
      <div>
        <YoutubeBigPlayer
          closeNav={() => this.closeNav()}
          video_object={this.state.video_object}
        />
        <input
          className="new_content"
          type="text"
          ref="inputContentLink"
          onChange={this.update.bind(this)}
        />
        <Button
          onClick={async () => {
            if (Object.keys(this.state.new_content).length !== 0) {
              var list_of_sources = this.state.playlists.slice();
              list_of_sources.push({
                content_id: this.state.new_content.id,
                content_type: this.state.new_content.type
              });
              const sources = uniq(list_of_sources);
              this.setState({ playlists: sources });
              this.setState({ new_content: {} });
              this.state.playlists.push();
              localStorage.setItem("sources", JSON.stringify(sources));
            }
          }}
        >
          +
        </Button>
        <p id="warning">{this.state.error}</p>
        <Queue listOfVideos={this.state.queue} />
        <FlexView className="video_column_collection">{this.generateVideoColumns()}</FlexView>
      </div>
    );
  }
}

class Queue extends Component {
  generate_queue_column() {
    return <div />;
  }

  render() {
    // console.log("video list in queue", this.props.listOfVideos);
    return this.generate_queue_column();
  }
}

export default App;
