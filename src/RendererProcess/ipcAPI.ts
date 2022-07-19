let tracks: string[] = [];

const setupElectronAPI = async() => {

    // Get tracks from MainProcess
    tracks = await window.api.getTracks();

    // Send to main that you want to quit
    // ipc is ipcRenderer which is declared above
    $('#close').on('click', () => {
        window.api.exit();
    });

    $('#settings').on('click', () => {
        window.api.settings();
    });

    $('#minimize').on('click', () => {
        window.api.minimize();
    });

    // Send volume slider position to main so it can be saved
    $("#volume-slider").on('change', () => {
        audioPlayer.volume = ($("#volume-slider").val() as number) / 100;

        window.api.saveVolume(audioPlayer.volume);
    });

    // On launch get saved volume and set the slider and player to use it
    const savedVolume = await window.api.getSavedVolume();
    $("#volume-slider").val(savedVolume * 100);
    console.log(`Received saved volume value: ${savedVolume}`);
    audioPlayer.volume = savedVolume;
};