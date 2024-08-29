"use client";

const darkTheme = "forest";
const lightTheme = "cupcake";
export default function ThemeSwitcher() {
  return (
    <input
      onChange={() => {
        document.documentElement.setAttribute(
          "data-theme",
          document.documentElement.getAttribute("data-theme") === darkTheme
            ? lightTheme
            : darkTheme,
        );
      }}
      type="checkbox"
      value="synthwave"
      className="toggle theme-controller"
    />
  );
}
