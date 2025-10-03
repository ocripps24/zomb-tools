import React from "react";

interface VideoHeroProps {
	videoId: string;
	posterImage?: string;
}

/**
 * Full-viewport background video hero component
 * Uses YouTube embed with autoplay, muted, no controls
 */
const VideoHero: React.FC<VideoHeroProps> = ({
	videoId,
	posterImage = "https://via.placeholder.com/1920x1080/1a1a1a/666666?text=Video+Loading"
}) => {
	const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&showinfo=0&rel=0&disablekb=1&fs=0&playsinline=1`;

	return (
		<div className="video-hero">
			<div className="video-hero__container">
				<iframe
					className="video-hero__iframe"
					src={embedUrl}
					title="Background Video"
					allow="autoplay; encrypted-media"
					allowFullScreen
					loading="lazy"
					style={{
						backgroundImage: `url(${posterImage})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				/>
			</div>
		</div>
	);
};

export default VideoHero;
