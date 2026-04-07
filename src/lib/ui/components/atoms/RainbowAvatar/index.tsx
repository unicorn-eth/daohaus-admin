import { AvatarComponent } from "@rainbow-me/rainbowkit";

export const CustomRainbowAvatar: AvatarComponent = ({ size }) => {
  return (
    <div
      style={{
        backgroundColor: "#15192d",
        borderRadius: 999,
        height: size,
        width: size,
      }}
    ></div>
  );
};
