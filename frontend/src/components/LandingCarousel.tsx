import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const images = [
  "/images/garden1.jpg",
  "/images/garden2.jpg",
  "/images/garden3.jpg",
];

export default function LandingCarousel() {
  return (
    <div className="landing-carousel">
      <Carousel
        autoPlay
        infiniteLoop
        interval={3000}
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        showArrows={false}
        stopOnHover={false}
        swipeable={false}
      >
        {images.map((src, idx) => (
          <div key={idx}>
            <img src={src} alt={`slide-${idx}`} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
