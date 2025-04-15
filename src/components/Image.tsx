import car from "../assets/images/sample_car.png";
import heroImage from "../assets/images/hero_image.png";

const images = {
  car,
  heroImage
};

type ImageName = keyof typeof images;

interface ImageProps {
  name: ImageName;
  className?: string;
  alt?: string;
}

export const Image = ({ name, className = "", alt = "" }: ImageProps) => {
  const imageSrc = images[name];
  return <img src={imageSrc} className={className} alt={alt} />;
};
