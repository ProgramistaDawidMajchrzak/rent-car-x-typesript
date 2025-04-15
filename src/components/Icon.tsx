import { ReactComponent as Heart } from "../assets/icons/heart.svg";
import { ReactComponent as Gas } from "../assets/icons/gas.svg";
import { ReactComponent as GearBox } from "../assets/icons/gear_box.svg";
import { ReactComponent as People } from "../assets/icons/people.svg";

const icons = {
  heart: Heart,
  gas: Gas,
  gear_box: GearBox,
  people: People,
};

type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  className?: string;
}

export const Icon = ({ name, className = "" }: IconProps) => {
  const IconComponent = icons[name];
  return <IconComponent className={className} />;
};