import React, { Component } from 'react';
import './App.css';
import VideoColumn from './VideoColumn';
import YoutubeBigPlayer from './YoutubeBigPlayer';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {uniq, retrieve_from_local_storage} from './utilities';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'react-flexview/lib/flexView.css';
import FlexView from 'react-flexview';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Braid</h1>
        </header>
        <PlaylistForm></PlaylistForm>
      </div>
    );
  }
}

class PlaylistForm extends Component {

  constructor() {
    super();
    this.state = {
      new_content: {},
      playlists: [],
      queue: [],
      watched: []};
    this.state.playlists = retrieve_from_local_storage("sources");
    this.state.watched = retrieve_from_local_storage("watched");
  }

  add_to_watched (content_id, video_id) {

    let watched_videos = this.state.watched.slice();
    watched_videos.push(video_id);
    this.setState({
      watched: watched_videos
    });
    localStorage.setItem("watched", JSON.stringify(uniq(watched_videos)));
  }

  remove_subscription (source_id) {
    let sources = this.state.playlists.slice();
    let updated_sources = sources.filter(function(e) {
              return e.content_id!==source_id;
            });
    this.setState({
      playlists: updated_sources
    });
    localStorage.setItem("sources", JSON.stringify(updated_sources));
    console.log("post remove, sources should be", this.state.playlists);
  }

  add_video_to_list(video_object) {
    let list_of_videos = this.state.queue.slice();
    list_of_videos.push(video_object);
    this.setState({queue: list_of_videos})
  }

  update(e) {
    let url = this.refs.inputContentLink.value;
    if (url.includes("playlist")) {
      let playlist_id = url.includes("=")?url.substring(url.lastIndexOf("=")+1):url;
      this.setState({new_content: {
          id: playlist_id,
          "type": "playlist"
        }
      });
    } else if (url.includes("channel")) {
      let channel_id = url.includes("videos")?url.substring(url.lastIndexOf("channel")+8, url.lastIndexOf("/")):url.substring(url.lastIndexOf("/")+1);
      this.setState({new_content: {
          id: channel_id,
          "type": "channel"
        }
      });
    } else if (url.includes("user")) {
      let user_id = url.includes("videos")?url.substring(url.lastIndexOf("user")+5, url.lastIndexOf("/")):url.substring(url.lastIndexOf("/")+1);
      this.setState({new_content: {
          id: user_id,
          "type": "user"
        }
      });
    } else {
      this.setState({new_content : {}});
    }
  }

  play_on_click(video_object) {
    this.setState({
      video_object : video_object,
    });
  }

  generateVideoColumns() {
    let videos = [];

      const column_size = 12 / this.state.playlists.length ;
      for(let videoID in this.state.playlists) {
        let source_info = this.state.playlists[videoID];
        videos.push(
          <VideoColumn
            key={source_info.content_id}
            source_info={source_info}
            content_id={source_info.content_id}
            column_size={column_size}
            on_click={(x) => {this.play_on_click(x)}}
            remove_subscription={(x) => this.remove_subscription(x)}
            add_to_queue={(x) => {
                this.add_video_to_list(x);
              }
            }
            add_to_watched={(x) => {
                this.add_to_watched(source_info.content_id, x);
              }
            }
          />
        );
      }
    return videos;
  }

  closeNav() {
    this.setState({ video_object : {} })
  }

  render() {
    return <div>
    <YoutubeBigPlayer closeNav={() => this.closeNav()} video_object={this.state.video_object}/>
      <input type="text" ref="inputContentLink" onChange={this.update.bind(this)}/>
      <Button onClick={
        async ()=>{
          if(Object.keys(this.state.new_content).length !== 0){
            var list_of_sources = this.state.playlists.slice();
            list_of_sources.push({
              "content_id" : this.state.new_content.id,
              "content_type" : this.state.new_content.type,
            });
            const sources = uniq(list_of_sources);
            this.setState({playlists: sources});
            this.setState({new_content : {}});
            this.state.playlists.push();
            console.log("adding to localStorage", sources);
            localStorage.setItem("sources", JSON.stringify(sources));
          }

        }
      }>+</Button>
      <Queue listOfVideos={this.state.queue}/>
      <FlexView>{this.generateVideoColumns()}</FlexView>
    </div>
  }
}

class Queue extends Component {

  generate_queue_column() {
    return <div></div>;
  }

  render() {
    // console.log("video list in queue", this.props.listOfVideos);
    return this.generate_queue_column();
  }


}

export default App;
