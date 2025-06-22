import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import { Card, CardMedia } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import YouTube from 'react-youtube';
import extractVideoIDFromURL from '../helpers/ExtractVideoIDFromURL';
const ImageCarousel = ({ images }) => {
  // State to track the active slide
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const isFirstImageVideo = typeof images[0] === 'string' && images[0].startsWith('http');
  const sliderRef = useRef();
  // Carousel settings
  const settings = {
    // Enable dot indicators
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: !isPlaying,
    autoplaySpeed: 3000,
    beforeChange: (_, next) => setActiveSlide(next),
    // Custom dots container
    appendDots: dots => (
      <div
        style={{
          padding: '10px',
          position: 'absolute',
          bottom: '6px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <ul style={{ margin: '0px' }}> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div
        style={{
          width: activeSlide === i ? '15px' : '12px',
          height: activeSlide === i ? '15px' : '12px',
          background: activeSlide === i ? '#fff' : 'rgba(255, 255, 255, 0.8)',
          borderRadius: '50%',
          // Space out the dots
          margin: '0 4px',
          // Smooth transition for dot changes
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}
      />
    ),
  };

  const onVideoPlay = () => {
    setIsPlaying(true);
    sliderRef.current.slickPause();
  };

  const onVideoEnd = () => {
    setIsPlaying(false);
    sliderRef.current.slickPlay();
  };

  const onVideoPause = () => {
    setIsPlaying(false);
    sliderRef.current.slickPlay();
  };

  return (
    <Card>
      <Slider ref={sliderRef} {...settings}>
        {isFirstImageVideo && (
          <YouTube
            videoId={extractVideoIDFromURL(images[0])}
            opts={{ height: '500', width: '100%' }}
            onPlay={onVideoPlay}
            onPause={onVideoPause}
            onEnd={onVideoEnd}
          />
        )}
        {images.map((image, index) => {
          if (index === 0 && isFirstImageVideo) return null;
          return (
            <div key={index}>
              <CardMedia
                component="img"
                height="500"
                image={image}
                title={`Image ${index + 1} for current listing`}
              />
            </div>
          );
        })}
      </Slider>
    </Card>
  );
};

export default ImageCarousel;
