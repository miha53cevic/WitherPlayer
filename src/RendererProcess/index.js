// Globals
let play_pause = 'pause';   // 'pause' = ( || ) , 'play' = ( > )
let random = false;
let repeat = false;

let audioPlayer;
let current_track = 0;

// Initial load
window.onload = () => {
    init();
};

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
    const track = tracks[current_track].split('\\').join('/');
    const name = track.split('/').pop().slice(0, -4);
    $('.title').text(name);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function init() {

    // Create the list of tracks
    create_tracks_list(true);

    // Initialize player
    audioPlayer = new Audio(tracks[current_track]);
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
    $("#play-pause").bind('click', () => {
        $("#play-pause").removeClass();

        if (play_pause == 'play') {
            audioPlayer.play();
            play_pause = 'pause';
            $("#play-pause").addClass("fa fa-pause fa-3x nav-item");
        } else if (play_pause == 'pause') {
            audioPlayer.pause();
            play_pause = 'play';
            $("#play-pause").addClass("fa fa-play fa-3x nav-item");
        }
    });

    // Space keypress for pause and play
    $(window).keypress((e) => {
        if (e.key === ' ' || e.key === 'Spacebar') {
            $("#play-pause").removeClass();

            if (play_pause == 'play') {
                audioPlayer.play();
                play_pause = 'pause';
                $("#play-pause").addClass("fa fa-pause fa-3x nav-item");
            } else if (play_pause == 'pause') {
                audioPlayer.pause();
                play_pause = 'play';
                $("#play-pause").addClass("fa fa-play fa-3x nav-item");
            }
        }
    });

    // Random
    $("#random").bind('click', () => {
        random = !random;

        if (random) {
            $("#random").css('background-color', 'rgba(128, 128, 128, 0.5)');

            // Shuffle the tracks array
            shuffleArray(tracks);
            // Create the new track list
            create_tracks_list();
            // Play the new current song
            audioPlayer.src = tracks[current_track];
            audioPlayer.play();

        } else {
            $("#random").css('background-color', 'transparent');

            // Create a new tracklist that is sorted like default
            create_tracks_list(true);
            // Play the new current song
            audioPlayer.src = tracks[current_track];
            audioPlayer.play();
        }

        updateTitle();
    });

    // Repeat
    $("#repeat").bind('click', () => {
        repeat = !repeat;

        if (repeat) {
            $("#repeat").css('background-color', 'rgba(128, 128, 128, 0.5)');
        } else {
            $("#repeat").css('background-color', 'transparent');
        }

        audioPlayer.loop = repeat;
    });

    // Skip back
    $("#step-backward").bind('click', () => {
        if (current_track > 0) {
            current_track--;
            audioPlayer.src = tracks[current_track];
            console.log(play_pause);

            // If button is set on Pause ( || ) then continue playing 
            // otherwise if the button is on ( > ) stop playing
            if (play_pause === 'pause')
                audioPlayer.play();

            updateTitle();
        }
    });

    // Skip forward
    $("#step-forward").bind('click', () => {
        if (current_track + 1 < tracks.length) {
            current_track++;
            audioPlayer.src = tracks[current_track];
            
            // If button is set on Pause ( || ) then continue playing 
            // otherwise if the button is on ( > ) stop playing
            if (play_pause === 'pause')
                audioPlayer.play();

            updateTitle();
        }
    });

    // Volume
    $("#volume-slider").bind('change', () => {
        audioPlayer.volume = $("#volume-slider").val() / 100;
    });
}