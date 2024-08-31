import Image from "next/image";
import Link from "next/link";
import ThemeSwitcher from "./theme-switch";

export default function Header() {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          <Image height={32} width={32} alt="icon" src="/icon.png" /> اقرألي
        </Link>
      </div>
      <div className="flex-none">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
