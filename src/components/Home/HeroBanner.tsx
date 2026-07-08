import React from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import styles from "../../styles/Home/HeroBanner.module.css";
import luxury from "../../assets/Yatch/luxury.jpg";
import sunset from "../../assets/Yatch/sunset.jpg";
import corporate from "../../assets/Yatch/corporate.jpg";
import adventure from "../../assets/Yatch/adventure.jpg";
import romantic from "../../assets/Yatch/romantic.jpeg";
import itinerary from "../../assets/Yatch/itinerary.jpg";

const categories = [
  {
    title: "Goa",
    image: luxury,
    href: "/discover",
  },
  {
    title: "Mumbai",
    image: sunset,
    href: "/coming-soon",
  },
  {
    title: "Kerala",
    image: corporate,
    href: "/coming-soon",
  },
  {
    title: "Dubai",
    image: adventure,
    href: "/coming-soon",
  },
  {
    title: "Indonesia",
    image: romantic,
    href: "/coming-soon",
  },
  {
    title: "Bali",
    image: itinerary,
    href: "/coming-soon",
  },
  {
    title: "Singapore",
    image: luxury,
    href: "/coming-soon",
  },
  {
    title: "Thailand",
    image: sunset,
    href: "/coming-soon",
  },
];

const MotionLink = motion(Link);

const HeroBanner: React.FC = () => {
  return (
    <div className={styles.heroWrap}>
      <motion.section
        className={styles.heroContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className={styles.heroHeading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <span className={styles.headingAccent}>Exclusive Yacht Rentals</span>
          <br />
          <span>Available</span>
        </motion.h1>
        <motion.p
          className={styles.heroSub}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          Discover unparalleled luxury and convenience with our premier
          yacht booking in India. Your exclusive adventure awaits on the
          water.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        >
          <Link to="/location" className={styles.heroBtn}>
            Book Your Yacht
          </Link>
        </motion.div>
      </motion.section>

      <div className={styles.categorySlider}>
        <Swiper
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={20}
          loop={true}
          autoplay={{ delay: 2600, disableOnInteraction: false, pauseOnMouseEnter: true }}
          style={{ padding: "4px 4px 8px" }}
        >
          {categories.map((category) => (
            <SwiperSlide key={category.title} className={styles.categorySlide}>
              <MotionLink to={category.href} className={styles.categoryCard}>
                <img
                  src={category.image}
                  alt={category.title}
                  className={styles.categoryImage}
                />
                <div className={styles.categoryOverlay} />
                <h2 className={styles.categoryTitle}>{category.title}</h2>
                <div className={styles.categoryArrowCorner}>
                  <ArrowUpRight size={18} />
                </div>
              </MotionLink>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HeroBanner;
