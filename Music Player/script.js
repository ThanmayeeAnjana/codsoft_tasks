let songs = [];

const upload = document.getElementById("upload");
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progressContainer");

const current = document.getElementById("current");
const duration = document.getElementById("duration");

const volume = document.getElementById("volume");

const playlist = document.getElementById("playlist");

const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");

const coverContainer = document.querySelector(".cover");

let index = 0;
let playing = false;
let repeat = false;

let db;

const request = indexedDB.open("MusicPlayerDB", 1);

request.onupgradeneeded = function (e) {
    db = e.target.result;

    if (!db.objectStoreNames.contains("songs")) {
        db.createObjectStore("songs", {
            keyPath: "id",
            autoIncrement: true
        });
    }
};

request.onsuccess = function (e) {
    db = e.target.result;
    loadSavedSongs();
};

request.onerror = function () {
    console.log("Database Error");
};

// Upload Songs
upload.addEventListener("change", (e) => {

    const files = [...e.target.files];

    files.forEach(file => {

        const transaction = db.transaction("songs", "readwrite");
        const store = transaction.objectStore("songs");

        store.add({
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Unknown Artist",
            file: file
        });

    });

    setTimeout(loadSavedSongs, 500);

});

function loadSavedSongs() {

    songs = [];

    playlist.innerHTML = "";

    const transaction = db.transaction("songs", "readonly");
    const store = transaction.objectStore("songs");

    store.openCursor().onsuccess = function (e) {

        const cursor = e.target.result;

        if (cursor) {

            const data = cursor.value;

            songs.push({

                id: data.id,
                title: data.title,
                artist: data.artist,
                src: URL.createObjectURL(data.file),
                cover: "images/default.jpg"

            });

            cursor.continue();

        } else {

            createPlaylist();

            if (songs.length > 0) {

                loadSong(0);

            }

        }

    };

}

function deleteSong(id){

    const transaction = db.transaction("songs","readwrite");

    const store = transaction.objectStore("songs");

    store.delete(id);

    loadSavedSongs();

}

// Create Playlist
function createPlaylist() {

    playlist.innerHTML = "";

    songs.forEach((song, i) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${song.title}</strong><br>
            ${song.artist}
        `;

        li.onclick = () => {
            index = i;
            loadSong(index);
            playSong();
        };

        const del = document.createElement("button");

del.innerHTML = "🗑";

del.style.float = "right";

del.onclick = (e)=>{

    e.stopPropagation();

    deleteSong(song.id);

};

li.appendChild(del);

playlist.appendChild(li);

    });

    highlight();
}

// Load Song
function loadSong(i) {

    if (songs.length === 0) return;

    title.innerText = songs[i].title;
    artist.innerText = songs[i].artist;
    audio.src = songs[i].src;
    cover.src = songs[i].cover;

    highlight();
}

// Play
function playSong() {

    if (songs.length === 0) return;

    playing = true;
    audio.play();

    playBtn.innerHTML = '<i class="fas fa-pause"></i>';

    coverContainer.classList.add("play");

}

// Pause
function pauseSong() {

    playing = false;

    audio.pause();

    playBtn.innerHTML = '<i class="fas fa-play"></i>';

    coverContainer.classList.remove("play");

}

playBtn.onclick = () => {

    if (playing)
        pauseSong();
    else
        playSong();

};

// Next
nextBtn.onclick = () => {

    if (songs.length === 0) return;

    index++;

    if (index >= songs.length)
        index = 0;

    loadSong(index);

    playSong();

};

// Previous
prevBtn.onclick = () => {

    if (songs.length === 0) return;

    index--;

    if (index < 0)
        index = songs.length - 1;

    loadSong(index);

    playSong();

};

// Progress
audio.addEventListener("timeupdate", () => {

    const { duration: dur, currentTime } = audio;

    if (dur) {

        progress.style.width = (currentTime / dur) * 100 + "%";

        current.innerText = format(currentTime);

        duration.innerText = format(dur);

    }

});

function format(sec) {

    let m = Math.floor(sec / 60);

    let s = Math.floor(sec % 60);

    if (s < 10)
        s = "0" + s;

    return m + ":" + s;

}

progressContainer.onclick = (e) => {

    const width = progressContainer.clientWidth;

    audio.currentTime = (e.offsetX / width) * audio.duration;

};

volume.oninput = () => {

    audio.volume = volume.value;

};

audio.onended = () => {

    if (repeat)
        playSong();
    else
        nextBtn.click();

};

// Shuffle
shuffleBtn.onclick = () => {

    if (songs.length === 0) return;

    index = Math.floor(Math.random() * songs.length);

    loadSong(index);

    playSong();

};

// Repeat
repeatBtn.onclick = () => {

    repeat = !repeat;

    repeatBtn.style.background = repeat ? "#6C63FF" : "#eee";

    repeatBtn.style.color = repeat ? "white" : "black";

};

// Highlight Current Song
function highlight() {

    document.querySelectorAll("#playlist li").forEach((li, i) => {

        li.classList.toggle("active", i === index);

    });

}