import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ExternalLink,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useApi } from "../../../hooks/useApi";
import { formatDate } from "../../../utils/validation";

const CustomVideoPlayer = ({ videoUrl, title, onOpenExternal }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isYouTubeVideo, setIsYouTubeVideo] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [embedUrl, setEmbedUrl] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [iframePlaying, setIframePlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPauseOverlay, setShowPauseOverlay] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const fullscreenRef = useRef(null);

  useEffect(() => {
    const isYouTube =
      videoUrl &&
      (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"));
    setIsYouTubeVideo(isYouTube);

    if (isYouTube) {
      const embed = getVideoEmbedUrl(videoUrl);
      const thumbnail = getYouTubeThumbnail(videoUrl);
      setEmbedUrl(embed);
      setThumbnailUrl(thumbnail);
    }
  }, [videoUrl]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        handleExitFullscreen();
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [isFullscreen]);

  const handlePlayPause = async () => {
    if (isYouTubeVideo && embedUrl) {
      setShowIframe(true);
      setTimeout(() => {
        const iframe = containerRef.current?.querySelector("iframe");
        if (iframe) {
          try {
            iframe.contentWindow?.postMessage(
              '{"event":"command","func":"playVideo","args":""}',
              "*"
            );
          } catch (error) {}
        }
      }, 1000);
      return;
    }

    if (!videoRef.current) return;

    setIsLoading(true);

    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing video:", error);
      if (onOpenExternal) {
        onOpenExternal();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMuteToggle = () => {
    console.log("Mute toggle clicked");
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    setIsFullscreen(true);
  };

  const handleExitFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleCloseVideo = () => {
    if (isYouTubeVideo && showIframe) {
      const iframe =
        fullscreenRef.current?.querySelector("iframe") ||
        containerRef.current?.querySelector("iframe");
      if (iframe) {
        try {
          iframe.contentWindow?.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            "*"
          );
        } catch (error) {}
      }
    } else if (!isYouTubeVideo && videoRef.current) {
      videoRef.current.pause();
    }

    setIsPlaying(false);
    setIframePlaying(false);
    setShowPauseOverlay(false);
    setShowIframe(false);
    setIsFullscreen(false);
  };

  const handleVideoClick = (e) => {
    e.stopPropagation();

    if (isYouTubeVideo && showIframe) {
      const iframe =
        fullscreenRef.current?.querySelector("iframe") ||
        containerRef.current?.querySelector("iframe");
      if (iframe) {
        try {
          if (iframePlaying) {
            iframe.contentWindow?.postMessage(
              '{"event":"command","func":"pauseVideo","args":""}',
              "*"
            );
            setIframePlaying(false);
            setShowPauseOverlay(true);
          } else {
            iframe.contentWindow?.postMessage(
              '{"event":"command","func":"playVideo","args":""}',
              "*"
            );
            setIframePlaying(true);
            setShowPauseOverlay(false);
          }
        } catch (error) {}
      }
    } else if (!isYouTubeVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowPauseOverlay(true);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setShowPauseOverlay(false);
      }
    }
  };

  const handleResumePlay = () => {
    setShowPauseOverlay(false);

    if (isYouTubeVideo && showIframe) {
      const iframe = containerRef.current?.querySelector("iframe");
      if (iframe) {
        try {
          iframe.contentWindow?.postMessage(
            '{"event":"command","func":"playVideo","args":""}',
            "*"
          );
          setIframePlaying(true);
        } catch (error) {}
      }
    } else if (!isYouTubeVideo && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleExternalOpen = () => {
    if (onOpenExternal) {
      onOpenExternal();
    }
  };

  const handleIframePlayPause = () => {
    const iframe = containerRef.current?.querySelector("iframe");
    if (iframe) {
      try {
        if (iframePlaying) {
          iframe.contentWindow?.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            "*"
          );
          setIframePlaying(false);
        } else {
          iframe.contentWindow?.postMessage(
            '{"event":"command","func":"playVideo","args":""}',
            "*"
          );
          setIframePlaying(true);
        }
      } catch (error) {}
    }
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div
          ref={fullscreenRef}
          className="relative w-full h-full bg-black"
          onClick={(e) => {
            e.stopPropagation();
            handleVideoClick(e);
          }}
        >
          {isYouTubeVideo && embedUrl ? (
            <>
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen={false}
                title={`Video for ${title}`}
                onLoad={() => {
                  setIframePlaying(true);
                  setTimeout(() => {
                    const iframe =
                      fullscreenRef.current?.querySelector("iframe");
                    if (iframe) {
                      try {
                        iframe.contentWindow?.postMessage(
                          '{"event":"command","func":"playVideo","args":""}',
                          "*"
                        );
                      } catch (error) {}
                    }
                  }, 500);
                }}
              />
              <div
                className="absolute inset-0 pointer-events-auto z-5"
                onClick={(e) => {
                  e.stopPropagation();
                  handleVideoClick(e);
                }}
                style={{
                  background: "transparent",
                  pointerEvents: "auto",
                }}
              />
            </>
          ) : (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-contain"
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              onLoadedData={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
              }}
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/webm" />
              <source src={videoUrl} type="video/ogg" />
              Ваш браузер не поддерживает видео.
            </video>
          )}

          {showPauseOverlay && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <button
                onClick={handleResumePlay}
                className="bg-[#6A4CFF] hover:bg-[#5A3CE8] text-white rounded-full p-6 transition-all duration-200 transform hover:scale-105 shadow-xl border-2 border-white/20"
              >
                <Play className="w-12 h-12 ml-1" />
              </button>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleVideoClick}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors z-20"
                  style={{ pointerEvents: "auto" }}
                >
                  {isYouTubeVideo ? (
                    iframePlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8" />
                    )
                  ) : isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8" />
                  )}
                </button>

                <button
                  onClick={handleExitFullscreen}
                  className="bg-[#6A4CFF] hover:bg-[#5A3CE8] text-white rounded-full p-3 transition-colors z-20"
                  style={{ pointerEvents: "auto" }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9V4.5M15 9h4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15v4.5M15 15h4.5M15 15l5.5 5.5"
                    />
                  </svg>
                </button>
              </div>

              <button
                onClick={handleCloseVideo}
                className="bg-[#6A4CFF] hover:bg-[#5A3CE8] text-white rounded-full p-3 transition-colors z-20"
                style={{ pointerEvents: "auto" }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-lg overflow-hidden group"
      style={{ paddingBottom: "56.25%" }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {isYouTubeVideo ? (
        showIframe && embedUrl ? (
          <>
            <div
              className="absolute top-0 left-0 w-full h-full rounded-lg cursor-pointer"
              onClick={handleVideoClick}
            >
              <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen={false}
                title={`Video for ${title}`}
                loading="lazy"
                onLoad={() => {
                  setIframePlaying(true);
                  setTimeout(() => {
                    const iframe =
                      containerRef.current?.querySelector("iframe");
                    if (iframe) {
                      try {
                        iframe.contentWindow?.postMessage(
                          '{"event":"command","func":"playVideo","args":""}',
                          "*"
                        );
                      } catch (error) {}
                    }
                  }, 500);
                }}
              />
            </div>

            {showPauseOverlay && !iframePlaying && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <button
                  onClick={handleResumePlay}
                  className="bg-[#6A4CFF] hover:bg-[#5A3CE8] text-white rounded-full p-4 transition-all duration-200 transform hover:scale-105 shadow-xl border-2 border-white/20"
                >
                  <Play className="w-8 h-8 ml-0.5" />
                </button>
              </div>
            )}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-200 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleIframePlayPause}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    {iframePlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>

                  <button
                    onClick={handleFullscreen}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleCloseVideo}
                  className="bg-[#6A4CFF] hover:bg-[#5A3CE8] text-white rounded-full p-2 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-black rounded-lg overflow-hidden">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={`Thumbnail for ${title}`}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
            )}

            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayPause}
                className="bg-[#6A4CFF] hover:bg-[#5A3CE8] text-white rounded-full p-4 transition-all duration-200 transform hover:scale-105 shadow-xl border-2 border-white/20"
              >
                <Play className="w-8 h-8 ml-0.5" />
              </button>
            </div>
          </div>
        )
      ) : (
        <>
          <div
            className="absolute top-0 left-0 w-full h-full cursor-pointer"
            onClick={handleVideoClick}
          >
            <video
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              onLoadedData={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
              }}
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/webm" />
              <source src={videoUrl} type="video/ogg" />
              Ваш браузер не поддерживает видео.
            </video>
          </div>

          {showPauseOverlay && !isPlaying && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <button
                onClick={handleResumePlay}
                className="bg-[#6A4CFF] hover:bg-[#5A3CE8] text-white rounded-full p-4 transition-all duration-200 transform hover:scale-105 shadow-xl border-2 border-white/20"
              >
                <Play className="w-8 h-8 ml-0.5" />
              </button>
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handlePlayPause}
              disabled={isLoading}
              className="bg-[#6A4CFF] hover:bg-[#5A3CE8] text-white rounded-full p-4 transition-all duration-200 transform hover:scale-110 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </button>
          </div>

          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-200 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleMuteToggle}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={handleFullscreen}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleExternalOpen}
                className="flex items-center space-x-2 bg-[#6A4CFF] hover:bg-[#5A3CE8] text-white px-3 py-1 rounded text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Открыть видео</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const getYouTubeVideoId = (url) => {
  if (!url) return null;

  try {
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/watch")) {
      return url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtube.com/embed/")) {
      return url.split("embed/")[1].split("?")[0];
    }
  } catch (error) {
    console.error("Error parsing YouTube URL:", error);
  }
  return null;
};

const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

const getVideoEmbedUrl = (url) => {
  if (!url) return null;

  try {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = getYouTubeVideoId(url);

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&enablejsapi=1&origin=${window.location.origin}&autoplay=1&mute=0&controls=0&disablekb=1&fs=0`;
      }
    }

    if (url.includes("vimeo.com")) {
      const videoId = url.split("vimeo.com/")[1].split("?")[0];
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&autoplay=1&loop=0&muted=0`;
      }
    }

    if (url.match(/\.(mp4|webm|ogg|avi|mov)$/i)) {
      return null;
    }

    return url;
  } catch (error) {
    console.error("Error parsing video URL:", error);
    return null;
  }
};

const LotteryTab = ({ t }) => {
  const { getRaffles, loading, error } = useApi();
  const [raffles, setRaffles] = useState([]);

  const handleOpenExternal = (videoUrl) => {
    window.open(videoUrl, "_blank");
  };

  useEffect(() => {
    const loadRaffles = async () => {
      const result = await getRaffles();
      if (result.success) {
        setRaffles(result.data);
      } else {}
    };

    loadRaffles();
  }, [getRaffles]);

  const formatEndDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU");
    } catch (error) {
      return dateString;
    }
  };

  const formatPrizeAmount = (amount) => {
    return new Intl.NumberFormat("ru-RU").format(amount);
  };

  return (
    <div className="">
      <div className="px-2 py-2 overflow-y-auto custom-scrollbar">
        {raffles.length > 0 || loading ? (
          <h2 className="text-md font-semibold text-gray-500 mb-2 text-left">
            {t.lottery}
          </h2>
        ) : null}

        {loading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gradient-to-b from-[#5E5AF6] to-[#7C65FF] rounded-2xl p-3 text-white shadow-lg animate-pulse"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="h-6 bg-white/20 rounded-lg w-3/4"></div>
                  <div className="h-5 bg-white/20 rounded-full w-16"></div>
                </div>

                <div className="space-y-1 mb-2">
                  <div className="h-4 bg-white/20 rounded-lg w-full"></div>
                  <div className="h-4 bg-white/20 rounded-lg w-2/3"></div>
                </div>

                <div className="space-y-0.5 mb-2">
                  <div className="h-4 bg-white/20 rounded-lg w-1/2"></div>
                  <div className="h-4 bg-white/20 rounded-lg w-1/3"></div>
                </div>

                <div className="text-center">
                  <div
                    className="relative w-full"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-white/20 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-sm">
              {t.errorLoadingLottery}: {error}
            </p>
          </div>
        )}

        {raffles.length === 0 && !loading && !error && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-gray-500 text-lg">{t.noLotteriesFound}</p>
            </div>
          </div>
        )}

        {raffles.length > 0 && (
          <div className="space-y-2">
            {raffles.map((raffle) => (
              <div
                key={raffle.id}
                className={`bg-gradient-to-b from-[#5E5AF6] to-[#7C65FF] rounded-2xl p-3 text-white shadow-lg ${
                  !raffle.is_active ? "opacity-60" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-lg leading-tight">
                    {raffle.title}
                  </h3>
                  {!raffle.is_active && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2">
                      {t.completed}
                    </span>
                  )}
                </div>

                <div className="space-y-0.5 mb-2">
                  <p className="text-white/90 text-sm">
                    {t.lotDate}: {formatEndDate(raffle.end_date)}
                  </p>

                  <p className="text-white/90 text-sm">
                    {t.lotSum}: {formatPrizeAmount(raffle.prize_amount)} {t.sum}
                  </p>
                </div>

                <div className="text-center text-gray-400 font-medium">
                  {raffle.video_url ? (
                    <CustomVideoPlayer
                      videoUrl={raffle.video_url}
                      title={raffle.title}
                      onOpenExternal={() =>
                        handleOpenExternal(raffle.video_url)
                      }
                    />
                  ) : (
                    <div className="py-8">
                      <Play className="mx-auto mb-3 text-gray-300 w-12 h-12" />
                      <p className="text-sm">{t.videoPlaceholder}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LotteryTab;
