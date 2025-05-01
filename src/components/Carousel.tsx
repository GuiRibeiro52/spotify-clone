import React from "react";
import Slider from "react-slick";

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  settings?: object;
}

const defaultSettings = {
  dots: false,
  infinite: true,
  arrows: true,
  autoplay: false,
  speed: 500,
  slidesToShow: 5,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 768, settings: { slidesToShow: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1 } },
  ],
};

const Carousel = <T,>({ items, renderItem, settings = {} }: CarouselProps<T>) => {
  const sliderSettings = { ...defaultSettings, ...settings };

  return (
    <Slider {...sliderSettings}>
      {items.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
    </Slider>
  );
};

export default Carousel;