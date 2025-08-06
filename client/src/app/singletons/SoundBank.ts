import { debugLog } from "../utils/debugLog";

class SoundBank {
  private tick: HTMLAudioElement | null = null;
  private whoosh: HTMLAudioElement | null = null;
  private inGameBackgroundMusic: HTMLAudioElement | null = null;
  private podiumBackgroundMusic: HTMLAudioElement | null = null;

  preloadAllInGameMusicAndSoundFX() {
    this.preloadingTick();
    this.preloadingWhoosh();
    this.preloadingInGameBackgroundMusic();
    this.preloadingPodiumBackgroundMusic();
  }

  ///
  /// Pre-loading sounds
  ///
  preloadingTick() {
    if (!this.tick) {
      debugLog(`Preloading the 'tick' sound`);
      this.tick = new Audio("/assets/audio/countdown_tick.ogg");
      this.tick.load();
    }
  }

  preloadingWhoosh() {
    if (!this.whoosh) {
      debugLog(`Preloading the 'whoosh' sound`);
      this.whoosh = new Audio("/assets/audio/whoosh.ogg");
      this.whoosh.load();
    }
  }

  preloadingInGameBackgroundMusic() {
    if (!this.inGameBackgroundMusic) {
      debugLog(`Preloading the 'inGameBackgroundMusic' sound`);
      this.inGameBackgroundMusic = new Audio("/assets/audio/answering-question-bgm.ogg");
      this.inGameBackgroundMusic.load();
    }
  }

  preloadingPodiumBackgroundMusic() {
    if (!this.podiumBackgroundMusic) {
      debugLog(`Preloading the 'podiumBackgroundMusic' sound`);
      this.podiumBackgroundMusic = new Audio("/assets/audio/podium.mp3");
      this.podiumBackgroundMusic.load();
    }
  }


  ///
  /// Playing sounds
  ///
  playTick() {
    if (!this.tick) {
      return;
    }

    debugLog(`Playing the 'tick' sound`);
    this.tick.currentTime = 0;
    this.tick.play().catch(err => console.error(err));
  }

  playWhoosh() {
    if (!this.whoosh) {
      return;
    }

    debugLog(`Playing the 'whoosh' sound`);
    this.whoosh.currentTime = 0;
    this.whoosh.play().catch(err => console.error(err));
  }

  playInGameBackgroundMusic() {
    if (!this.inGameBackgroundMusic) {
      return;
    }

    debugLog(`Playing the 'inGameBackgroundMusic' sound`);
    this.inGameBackgroundMusic.currentTime = 0;
    this.inGameBackgroundMusic.play().catch(err => console.error(err));
  }

  playPodiumBackgroundMusic() {
    if (!this.podiumBackgroundMusic) {
      return;
    }

    debugLog(`Playing the 'podiumBackgroundMusic' sound`);
    this.podiumBackgroundMusic.currentTime = 0;
    this.podiumBackgroundMusic.play().catch(err => console.error(err));
  }


  ///
  /// Stopping sounds
  ///
  stopInGameBackgroundMusic() {
    if (!this.inGameBackgroundMusic) {
      return;
    }

    debugLog(`Stopping the 'inGameBackgroundMusic' sound`);
    this.inGameBackgroundMusic.pause();
    this.inGameBackgroundMusic.currentTime = 0;
  }
}

export default new SoundBank;
