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
let tracks = [];
const setupElectronAPI = () => __awaiter(void 0, void 0, void 0, function* () {
    // Get tracks from MainProcess
    tracks = yield window.api.getTracks();
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
        audioPlayer.volume = $("#volume-slider").val() / 100;
        window.api.saveVolume(audioPlayer.volume);
    });
    // On launch get saved volume and set the slider and player to use it
    const savedVolume = yield window.api.getSavedVolume();
    $("#volume-slider").val(savedVolume * 100);
    console.log(`Received saved volume value: ${savedVolume}`);
    audioPlayer.volume = savedVolume;
});
