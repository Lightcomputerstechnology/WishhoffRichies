// components/ScrollWrapper.js
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ScrollWrapper({ children, animation = "fade-up", duration = 800 }) {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <div data-aos={animation} data-aos-duration={duration}>
      {children}
    </div>
  );
}
