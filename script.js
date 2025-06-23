let currentSong = new Audio();
let songs;
let currentFolder;

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
async function getSongs(folder) {
  currentFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${currentFolder}`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      let song_name = element.href.split(`/${currentFolder}/`)[1]; // removign the link part
      songs.push(song_name);
    }
  }
  // show all the songs list
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
  for (const song of songs) {
    let song_name = song.replaceAll("%20", " ");
    // songUL.innerHTML = songUL.innerHTML + `<li></li>`
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
            <img class="invert" src="src/music.svg" alt="">
            <div class="info-container">
              <div class="info">
                <div>${song_name}</div>
                <div class="artist-name">Abhishek</div>
              </div>
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
  return songs;
}

// play music
let playMusic = (track, pause) => {
  currentSong.src = `/${currentFolder}/${track}`;
  if (pause) {
    currentSong.pause();
  } else {
    currentSong.play();
  }
  play.src = "/src/play.svg";
  // giving time duration and song info in seek bar
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};


async function main() {
  // get the list of all the song
  let songs = await getSongs("songs/regular");
  playMusic(songs[3], (pause = true));
  
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      // IMP (posted for checking status)
      currentSong.play();
      play.src = "/src/pause.svg";
    } else {
      currentSong.pause();
      play.src = "/src/play.svg";
    }
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

  // hamburger work
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

  document.querySelector(".hamburger1").addEventListener("click", () => {
    document.querySelector(".left").style.left = `-100%`;
  });


  // click outside to remove the left container.
  document.addEventListener("click", (e) => {
    const left = document.querySelector(".left");
    const hamburger = document.querySelector(".hamburger");
    if (!left.contains(e.target) && !hamburger.contains(e.target)) {
      left.style.left = `-100%`;
    }
  });

  // ADD an event listener to previous and next
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);
    if (index > 0) {
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });


  // add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = e.target.value / 100;
    });

  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      console.log("Fetching Songs");
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}
main();
