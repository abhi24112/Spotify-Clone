let currentSong = new Audio();

// current song time in minutes second
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}



// getting songs from the directory
async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      let song_name = element.href.split("/songs/")[1]; // removign the link part
      songs.push(song_name);
    }
  }
  return songs;
}

// play music
let playMusic = (track, pause) => {
  currentSong.src = `/songs/${track}`;
  if (pause){
    currentSong.pause()
  }else{
    currentSong.play();
  }
  play.src = "/src/play.svg";
  // giving time duration and song info in seek bar
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
};

play.addEventListener("click", () => {
  if (currentSong.paused) { // IMP (posted for checking status)
    currentSong.play();
    play.src = "/src/pause.svg";
  } 
  else {
    currentSong.pause();
    play.src = "/src/play.svg";
  }
});

async function main() {
  // get the list of all the song
  let songs = await getSongs();
  playMusic(songs[3], (pause = true));

  // show all the songs list
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    let song_name = song.replaceAll("%20", " ");
    // songUL.innerHTML = songUL.innerHTML + `<li></li>`
    songUL.innerHTML =
      songUL.innerHTML +
       `<li>
            <img class="invert" src="src/music.svg" alt="">
            <div class="info">
              <div>${song_name}</div>
              <div class="artist-name">Abhishek</div>
            </div>
            <div class="playnow">
              <span>Play Now</span>
              <img class="invert" src="src/play.svg" alt="">
            </div>
        </li>`;
  }

  // event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      let song = e.querySelector(".info").firstElementChild.innerHTML;
      playMusic(song);
    });
  });

  // Listen for timeupdate
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    // chaging seek bar
    document.querySelector(".circle").style.left = `${
      (currentSong.currentTime / currentSong.duration) * 100
    }%`;
  });

  // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });


}
main();
