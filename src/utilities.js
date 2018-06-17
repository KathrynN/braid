function getDataFromYoutube(json_request) {
  return fetch(json_request)
      .then(
        function(response){
          return response.json();
        });
}

function generateJSONRequestForPlaylist(playlist_id, request_size) {
    const API_KEY = process.env.REACT_APP_YT_API_KEY;
    const API = "https://www.googleapis.com/youtube/v3/playlistItems?"
    const PART = "snippet%2CcontentDetails"
    const MAX_RESULTS = request_size;
    var url = `${API}part=${PART}&maxResults=${MAX_RESULTS}&playlistId=${playlist_id}&key=${API_KEY}`
    return url;
}

function uniq(a) {
   return Array.from(new Set(a));
}


function generateJSONRequestForChannel(channel_username, request_size) {
    const API_KEY = process.env.REACT_APP_YT_API_KEY;
    const API = "https://www.googleapis.com/youtube/v3/search?"
    const PART = "snippet"
    const MAX_RESULTS = request_size
    var url = `${API}part=${PART}&maxResults=${MAX_RESULTS}&channelId=${channel_username}&key=${API_KEY}&order=date`
    return url;
}

function generateJSONRequestForUserRecentUploads(username, request_size) {
    const API_KEY = process.env.REACT_APP_YT_API_KEY;
    const API = "https://www.googleapis.com/youtube/v3/channels?"
    const PART = "contentDetails"
    var url = `${API}part=${PART}&forUsername=${username}&key=${API_KEY}`
    return getDataFromYoutube(url).then(function(fulfilled) {
        const uploadPlaylistId = fulfilled.items[0].contentDetails.relatedPlaylists.uploads;
        return generateJSONRequestForPlaylist(uploadPlaylistId, request_size);
      });
}

export {generateJSONRequestForChannel, generateJSONRequestForPlaylist, generateJSONRequestForUserRecentUploads, uniq, getDataFromYoutube}
