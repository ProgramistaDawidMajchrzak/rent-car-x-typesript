import { ReactComponent as Heart } from "../assets/icons/heart.svg";
import { ReactComponent as Gas } from "../assets/icons/gas.svg";
import { ReactComponent as GearBox } from "../assets/icons/gear_box.svg";
import { ReactComponent as People } from "../assets/icons/people.svg";
import { ReactComponent as Logo } from "../assets/icons/logo-admin.svg";
import { ReactComponent as Users } from "../assets/icons/users-nav.svg";
import { ReactComponent as Cars } from "../assets/icons/cars-admin.svg";
import { ReactComponent as Logout } from "../assets/icons/logout.svg";

const icons = {
  heart: Heart,
  gas: Gas,
  gear_box: GearBox,
  people: People,
  logo: Logo,
  users: Users,
  cars: Cars,
  logout: Logout,
};

type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  className?: string;
  onClick?: () => void;
}

export const Icon = ({ name, className = "", onClick }: IconProps) => {
  const IconComponent = icons[name];
  return <IconComponent className={className} onClick={onClick} />;
};