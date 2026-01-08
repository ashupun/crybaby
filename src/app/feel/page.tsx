"use client";

import { useState, useRef, useEffect } from "react";

type Track = {
  id: string;
  title: string;
  artist: string;
  url: string;
};

type Genre = {
  id: string;
  name: string;
  icon: string;
  color: string;
  tracks: Track[];
};

const genres: Genre[] = [
  {
    id: "rain",
    name: "Rain",
    icon: "🌧️",
    color: "#3b82f6",
    tracks: [
      { id: "rain1", title: "Rainy London Street", artist: "Victorian Vault", url: "https://archive.org/download/VictorianStoneStreetAmbientSounds/Rainy%20Afternoon%20on%20a%20London%20Street.mp3" },
      { id: "rain2", title: "Country Rain", artist: "Victorian Vault", url: "https://archive.org/download/VictorianStoneStreetAmbientSounds/Country%20Rain%20on%20a%20Spring%20Night.mp3" },
    ],
  },
  {
    id: "forest",
    name: "Forest",
    icon: "🌲",
    color: "#22c55e",
    tracks: [
      { id: "forest1", title: "Summer Forest Ride", artist: "Victorian Vault", url: "https://archive.org/download/VictorianStoneStreetAmbientSounds/Midnight%20Carriage%20Ride%20%28Summer%20Forest%29.mp3" },
      { id: "forest2", title: "Country Village", artist: "Victorian Vault", url: "https://archive.org/download/VictorianStoneStreetAmbientSounds/19th%20Century%20England%20Country%20Village.mp3" },
    ],
  },
  {
    id: "ocean",
    name: "Ocean",
    icon: "🌊",
    color: "#06b6d4",
    tracks: [
      { id: "ocean1", title: "Gentle Ocean", artist: "Nature", url: "https://archive.org/download/ocean-sea-sounds/Gentle%20Ocean.mp3" },
      { id: "ocean2", title: "Relaxing Waves", artist: "Nature", url: "https://archive.org/download/ocean-sea-sounds/Those_Relaxing_Sounds_of_Waves_-_Ocean_Sounds_1080p_HD_Video_with_Tropical_Beaches%20Part%201.mp3" },
    ],
  },
  {
    id: "wind",
    name: "Wind",
    icon: "💨",
    color: "#8b5cf6",
    tracks: [
      { id: "wind1", title: "Windy Desert", artist: "Victorian Vault", url: "https://archive.org/download/VictorianStoneStreetAmbientSounds/Victorian%20Quest%20-%20Windy%20Desert.mp3" },
      { id: "wind2", title: "Storm Cabin", artist: "Victorian Vault", url: "https://archive.org/download/VictorianStoneStreetAmbientSounds/Frontier%20Cabin%20During%20Storm%20I.mp3" },
    ],
  },
  {
    id: "fire",
    name: "Fire",
    icon: "🔥",
    color: "#f59e0b",
    tracks: [
      { id: "fire1", title: "Cozy Fireplace", artist: "Victorian Vault", url: "https://archive.org/download/VictorianStoneStreetAmbientSounds/Reading%20by%20the%20Fireplace.mp3" },
      { id: "fire2", title: "Evening Campfire", artist: "Victorian Vault", url: "https://archive.org/download/VictorianStoneStreetAmbientSounds/Evening%20Campfire%20by%20the%20Sea.mp3" },
    ],
  },
  {
    id: "water",
    name: "Water",
    icon: "💧",
    color: "#ec4899",
    tracks: [
      { id: "water1", title: "Sailboat Waves", artist: "Nature", url: "https://archive.org/download/ocean-sea-sounds/Sleep%20Aboard%20Sailboat.mp3" },
      { id: "water2", title: "Rocking Boat", artist: "Nature", url: "https://archive.org/download/ocean-sea-sounds/Waves%20Gently%20Rocking%20Boat%20-%201.mp3" },
    ],
  },
];

export default function FeelPage() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = () => {
      setError("Unable to load audio. Try another track.");
      setIsPlaying(false);
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setError(null);
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
    };
  }, [isLooping]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playTrack = (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    setError(null);

    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch(() => setError("Unable to play audio"));
        setIsPlaying(true);
      }
    } else {
      setIsLoading(true);
      setCurrentTrack(track);
      audio.src = track.url;
      audio.load();
      audio.play().catch(() => {
        setError("Unable to play audio");
        setIsLoading(false);
      });
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => setError("Unable to play audio"));
      setIsPlaying(true);
    }
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section className="h-[calc(100vh-180px)] overflow-hidden px-6 py-4 md:px-20 lg:px-32">
      <audio ref={audioRef} loop={isLooping} crossOrigin="anonymous" />

      <div className="flex flex-col h-full gap-6">
        <div>
          <h1 className="write-title text-4xl md:text-5xl font-bold dark:text-white">Feel the calm</h1>
          <p className="hero-subtitle text-base opacity-50 dark:text-white mt-2">Choose sounds that soothe your soul</p>
        </div>

        <div className="flex-1 grid md:grid-cols-3 gap-6 min-h-0">
          <div className="md:col-span-1 overflow-auto">
            <p className="text-base font-sans tracking-widest uppercase opacity-30 dark:text-white mb-4">Genres</p>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                    selectedGenre?.id === genre.id
                      ? "bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] border-transparent"
                      : "bg-[#faf9f7] dark:bg-[#2a2a2a] dark:text-white border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20"
                  }`}
                >
                  <span className="text-2xl">{genre.icon}</span>
                  <span className="text-lg font-medium">{genre.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-4 overflow-hidden">
            {selectedGenre ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedGenre.icon}</span>
                  <h2 className="text-2xl font-bold dark:text-white">{selectedGenre.name}</h2>
                </div>

                <div className="flex-1 overflow-auto space-y-3">
                  {selectedGenre.tracks.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => playTrack(track)}
                      className={`w-full flex items-center p-5 rounded-2xl border transition-all text-left ${
                        currentTrack?.id === track.id
                          ? "bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] border-transparent"
                          : "bg-[#faf9f7] dark:bg-[#2a2a2a] dark:text-white border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          currentTrack?.id === track.id ? "bg-white/20 dark:bg-black/20" : "bg-black/5 dark:bg-white/10"
                        }`}>
                          {currentTrack?.id === track.id && isLoading ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : currentTrack?.id === track.id && isPlaying ? (
                            <div className="flex gap-1">
                              <span className="w-1 h-4 bg-current rounded-full animate-pulse" />
                              <span className="w-1 h-4 bg-current rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                              <span className="w-1 h-4 bg-current rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                            </div>
                          ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-medium">{track.title}</p>
                          <p className={`text-sm ${currentTrack?.id === track.id ? "opacity-70" : "opacity-50"}`}>{track.artist}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-lg opacity-40 dark:text-white">Select a genre to begin</p>
              </div>
            )}
          </div>
        </div>

        {currentTrack && (
          <div className="bg-[#faf9f7] dark:bg-[#2a2a2a] rounded-2xl p-5 border border-black/5 dark:border-white/10">
            <div className="flex items-center gap-6">
              <button
                onClick={togglePlay}
                disabled={isLoading}
                className="w-14 h-14 rounded-full bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] flex items-center justify-center shrink-0 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="truncate">
                    <p className="text-lg font-medium dark:text-white truncate">{currentTrack.title}</p>
                    {error ? (
                      <p className="text-sm text-red-500">{error}</p>
                    ) : (
                      <p className="text-sm opacity-50 dark:text-white/50">{currentTrack.artist}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <button
                      onClick={() => setIsLooping(!isLooping)}
                      className={`p-2 rounded-full transition-opacity ${isLooping ? "opacity-100" : "opacity-40"}`}
                      title={isLooping ? "Loop on" : "Loop off"}
                    >
                      <svg className="w-5 h-5 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    <div className="flex items-center gap-2 w-28">
                      <svg className="w-4 h-4 opacity-50 dark:text-white/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full accent-[#1a1a1a] dark:accent-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm opacity-50 dark:text-white/50 w-14 text-right">{formatTime(progress)}</span>
                  <div
                    className="flex-1 h-2 bg-black/10 dark:bg-white/10 rounded-full cursor-pointer overflow-hidden"
                    onClick={seekTo}
                  >
                    <div
                      className="h-full bg-[#1a1a1a] dark:bg-white rounded-full transition-all"
                      style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
                    />
                  </div>
                  <span className="text-sm opacity-50 dark:text-white/50 w-14">{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
