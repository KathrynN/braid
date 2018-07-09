function getDataFromYoutube(json_request) {
  return fetch(json_request).then(function(response) {
    return response.json();
  });
}

function generateJSONRequestForPlaylist(playlist_id, request_size) {
  const API_KEY = process.env.REACT_APP_YT_API_KEY;
  const API = "https://www.googleapis.com/youtube/v3/playlistItems?";
  const PART = "snippet%2CcontentDetails";
  const MAX_RESULTS = request_size;
  var url = `${API}part=${PART}&maxResults=${MAX_RESULTS}&playlistId=${playlist_id}&key=${API_KEY}`;
  return url;
}

function uniq(a) {
  return Array.from(new Set(a));
}

function generateJSONRequestForChannel(channel_username, request_size) {
  const API_KEY = process.env.REACT_APP_YT_API_KEY;
  const API = "https://www.googleapis.com/youtube/v3/search?";
  const PART = "snippet";
  const MAX_RESULTS = request_size;
  var url = `${API}part=${PART}&maxResults=${MAX_RESULTS}&channelId=${channel_username}&key=${API_KEY}&order=date`;
  return url;
}

function generateJSONRequestForUserRecentUploads(username, request_size) {
  const API_KEY = process.env.REACT_APP_YT_API_KEY;
  const API = "https://www.googleapis.com/youtube/v3/channels?";
  const PART = "contentDetails";
  var url = `${API}part=${PART}&forUsername=${username}&key=${API_KEY}`;
  return getDataFromYoutube(url).then(function(fulfilled) {
    if (fulfilled.items.length !== 0) {
      const uploadPlaylistId =
        fulfilled.items[0].contentDetails.relatedPlaylists.uploads;
      return generateJSONRequestForPlaylist(uploadPlaylistId, request_size);
    } else {
      return "user has no videos";
    }
  });
}

function retrieve_from_local_storage(key) {
  try {
    const tokens = localStorage.getItem(key);
    if (tokens !== null) {
      return JSON.parse(tokens);
    }
    return [];
  } catch (e) {
    console.log(e.message);
    return [];
  }
}

function retrieve_object_from_local_storage(key) {
  try {
    const tokens = localStorage.getItem(key);
    if (tokens !== null) {
      const object_to_return = JSON.parse(tokens);
      if (object_to_return.length === 0){
        return {};
      }
      return JSON.parse(tokens);
    }
    return {};
  } catch (e) {
    console.log(e.message);
    return {};
  }
}


function is_video_watched(content_id, video_id) {
  const watched_videos = retrieve_from_local_storage("watched");
  const watched_videos_by_content = retrieve_from_local_storage("watched_by_content");
  let is_in_content;
  if (watched_videos_by_content[content_id] === undefined) {
    is_in_content = false;
  } else {
    is_in_content = watched_videos_by_content[content_id].includes(video_id);
  }
  return is_in_content || watched_videos.includes(video_id);
}

export {
  is_video_watched,
  retrieve_from_local_storage,
  retrieve_object_from_local_storage,
  generateJSONRequestForChannel,
  generateJSONRequestForPlaylist,
  generateJSONRequestForUserRecentUploads,
  uniq,
  getDataFromYoutube
};
