// types.ts
export interface BannerImage {
  url: string;
  alt: string;
}

// BannerSlider.tsx
import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";

interface BannerSliderProps {
  images: BannerImage[];
  activeDotColor?: string;
  inactiveDotColor?: string;
}

const SliderContainer = styled.div`
  padding: 0 20px;

  @media (min-width: 768px) {
    padding: 0 40px;
  }

  @media (min-width: 1024px) {
    padding: 0 60px;
  }
`;

const StyledSlider = styled(Slider)`
  .slick-dots {
    bottom: -30px;

    li {
      margin: 0 5px;

      button:before {
        font-size: 9px;
        color: ${(props) => props.theme.inactiveDotColor || "#999"};
        opacity: 1;
      }

      &.slick-active button:before {
        color: ${(props) => props.theme.activeDotColor || "#fff"};
        opacity: 1;
      }
    }
  }

  .slick-slide {
    padding: 0 10px;

    div {
      line-height: 0;
    }
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 0.75rem; // xl border radius
  overflow: hidden;

  @media (max-width: 768px) {
    aspect-ratio: 16/9;
  }
`;

const BannerSlider: React.FC<BannerSliderProps> = ({
  images,
  activeDotColor = "#fff",
  inactiveDotColor = "#999",
}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <SliderContainer>
      <StyledSlider {...settings} theme={{ activeDotColor, inactiveDotColor }}>
        {images.map((image, index) => (
          <ImageWrapper key={index}>
            <Image
              src={image.url}
              alt={image.alt}
              fill
              style={{
                objectFit: "cover",
              }}
              quality={100}
              priority={index === 0}
            />
          </ImageWrapper>
        ))}
      </StyledSlider>
    </SliderContainer>
  );
};

export default BannerSlider;
