"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Globals
let play_pause_icon = 'pause';
let random = false;
let repeat = false;
const audioPlayer = new Audio();
let current_track = 0;
// Initial load
window.onload = () => __awaiter(void 0, void 0, void 0, function* () {
    yield setupElectronAPI();
    init();
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function toInt(number) {
    return Number.parseInt((number).toString());
}
function create_tracks_list(alphebeticalSort = false) {
    // Accept only .ogg and .mp3 formats
    for (let i = 0; i < tracks.length; i++) {
        const name = tracks[i].split('\\').pop();
        // If a element doesn't contain .ogg .mp3 file formats remove it
        if (!name.includes('.mp3') && !name.includes('.ogg')) {
            tracks.splice(i, 1);
            i--;
        }
    }
    console.log("Found " + tracks.length + " track(s)!");
    // Sort by alphebetical order
    if (alphebeticalSort) {
        tracks.sort((a, b) => {
            let element1 = a.split('\\').join('/');
            let element2 = b.split('\\').join('/');
            element1 = element1.split('/').pop();
            element2 = element2.split('/').pop();
            element1 = element1.toLowerCase();
            element2 = element2.toLowerCase();
            // if (a < b) return -1 or (if (b < a) return 1 or 0), na kraju returna -1, 1, ili 0
            return element1 < element2 ? -1 : element2 < element1 ? 1 : 0;
        });
    }
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function updateTitle() {
    var _a;
    const track = tracks[current_track].split('\\').join('/');
    const name = (_a = track.split('/').pop()) === null || _a === void 0 ? void 0 : _a.slice(0, -4);
    $('.title').text(name);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function init() {
    // Create the list of tracks
    create_tracks_list(true);
    // Initialize player
    audioPlayer.src = tracks[current_track];
    audioPlayer.play();
    // Set song name
    updateTitle();
    // Check if audio has finished
    audioPlayer.addEventListener('ended', () => {
        current_track++;
        // If the end of the list has been hit reset to first position
        if (current_track >= tracks.length) {
            current_track = 0;
        }
        audioPlayer.src = tracks[current_track];
        audioPlayer.play();
        // Set song name
        updateTitle();
    });
    // Play-Pause
    $("#play-pause").on('click', () => {
        $("#play-pause").removeClass();
        if (play_pause_icon == 'play') {
            audioPlayer.play();
            play_pause_icon = 'pause';
            $("#play-pause").addClass("fa fa-pause fa-3x nav-item");
        }
        else if (play_pause_icon == 'pause') {
            audioPlayer.pause();
            play_pause_icon = 'play';
            $("#play-pause").addClass("fa fa-play fa-3x nav-item");
        }
    });
    // Space keypress for pause and play
    $(window).on('keypress', (e) => {
        if (e.key === ' ' || e.key === 'Spacebar') {
            $("#play-pause").removeClass();
            if (play_pause_icon == 'play') {
                audioPlayer.play();
                play_pause_icon = 'pause';
                $("#play-pause").addClass("fa fa-pause fa-3x nav-item");
            }
            else if (play_pause_icon == 'pause') {
                audioPlayer.pause();
                play_pause_icon = 'play';
                $("#play-pause").addClass("fa fa-play fa-3x nav-item");
            }
        }
    });
    // Random
    $("#random").on('click', () => {
        random = !random;
        if (random) {
            $("#random").css('background-color', 'rgba(128, 128, 128, 0.5)');
            // Shuffle the tracks array
            shuffleArray(tracks);
            // Create the new track list
            create_tracks_list();
            // Set the new track
            audioPlayer.src = tracks[current_track];
        }
        else {
            $("#random").css('background-color', 'transparent');
            // Create a new tracklist that is sorted like default
            create_tracks_list(true);
            // Play the new current song
            audioPlayer.src = tracks[current_track];
        }
        // If button is pause ( || ) then we continue playing
        if (play_pause_icon === 'pause')
            audioPlayer.play();
        // If button is play ( > ) then we are still paused
        else if (play_pause_icon === 'play')
            audioPlayer.pause();
        updateTitle();
    });
    // Repeat
    $("#repeat").on('click', () => {
        repeat = !repeat;
        if (repeat) {
            $("#repeat").css('background-color', 'rgba(128, 128, 128, 0.5)');
        }
        else {
            $("#repeat").css('background-color', 'transparent');
        }
        audioPlayer.loop = repeat;
    });
    // Skip back
    $("#step-backward").on('click', () => {
        if (current_track > 0) {
            current_track--;
            audioPlayer.src = tracks[current_track];
            console.log(play_pause_icon);
            // If button is set on Pause ( || ) then continue playing 
            // otherwise if the button is on ( > ) stop playing
            if (play_pause_icon === 'pause')
                audioPlayer.play();
            updateTitle();
        }
    });
    // Skip forward
    $("#step-forward").on('click', () => {
        if (current_track + 1 < tracks.length) {
            current_track++;
            audioPlayer.src = tracks[current_track];
            // If button is set on Pause ( || ) then continue playing 
            // otherwise if the button is on ( > ) stop playing
            if (play_pause_icon === 'pause')
                audioPlayer.play();
            updateTitle();
        }
    });
}
