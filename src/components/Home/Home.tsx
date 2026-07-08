import React from "react";
import styles from "../../styles/Home/Home.module.css";
import YachtCard from "../Layouts/YatchCard";
import ErrorBoundary from "../ErrorBoundary";
import HeroBanner from "./HeroBanner";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import SolutionCard from "../Layouts/SolutionCard";
import EventCard from "../Layouts/EventCard";
import { useTopYachts } from "../../hooks/useTopYacht";
import sunset from "../../assets/Yatch/sunset.jpg";
import adventure from "../../assets/Yatch/adventure.jpg";
import corporate from "../../assets/Yatch/corporate.jpg";
import itinerary from "../../assets/Yatch/itinerary.jpg";
import romantic from "../../assets/Yatch/romantic.jpeg";
import luxury from "../../assets/Yatch/luxury.jpg";
const solutionData = [
  {
    id: "solution-1",
    heading: "Comprehensive Yacht Listings",
    subheading: "Explore an extensive array of yachts ready for booking with detailed specifications.",
  },
  {
    id: "solution-2",
    heading: "Seamless Booking Experience",
    subheading: "Enjoy a smooth and efficient booking process tailored to your specific needs.",
  },
  {
    id: "solution-3",
    heading: "Real-Time Availability Updates",
    subheading: "Stay informed with instant updates on yacht availability to plan your journey.",
  },
  {
    id: "solution-4",
    heading: "Customizable Itinerary Planning",
    subheading: "Create personalized itineraries with ease, ensuring a memorable voyage experience.",
  },
  {
    id: "solution-5",
    heading: "Secure Payment Solutions",
    subheading: "Benefit from robust and secure payment options to safeguard your transactions.",
  },
  {
    id: "solution-6",
    heading: "Dedicated Customer Support",
    subheading: "Access 24/7 customer support for any inquiries or assistance during your trip.",
  },
];

const eventData = [
  {
    id: "event-1",
    imgUrl: sunset,
    event: "Sunset Cruise Packages",
  },
  {
    id: "event-2",
    imgUrl: luxury,
    event: "Luxury Yacht Experience",
  },
  {
    id: "event-3",
    imgUrl: corporate,
    event: "Corporate Event Charters",
  },
  {
    id: "event-4",
    imgUrl: romantic,
    event: "Romantic Yacht Getaways",
  },
  {
    id: "event-5",
    imgUrl: adventure,
    event: "Adventure Tours",
  },
  {
    id: "event-6",
    imgUrl: itinerary,
    event: "Custom Itinerary Voyages",
  },
];

const Home: React.FC = () => {
  const { yachts } = useTopYachts();

  return (
    <div className={styles.comp_body}>
      <HeroBanner />
      <div className={styles.yatchBox}>
        <div className={styles.section_head}>
          Yacht Near You
        </div>
        <div className={styles.yatch_slider}>
          <Swiper
            spaceBetween={50}
            slidesPerView="auto"
            pagination={{ clickable: true }}
            style={{ 
              padding: "20px 0", 
              width: "100%",
            }}
            breakpoints={{
              320: {
                slidesPerView: "auto",
                spaceBetween: 10
              },
              480: {
                slidesPerView: "auto",
                spaceBetween: 15
              },
              768: {
                slidesPerView: "auto",
                spaceBetween: 20
              },
              1024: {
                slidesPerView: "auto",
                spaceBetween: 40
              }
            }}
          >
            {yachts.map((yacht) => (
              <SwiperSlide key={yacht._id} className={styles.swiper_slide} >
                <ErrorBoundary>
                  {/* @ts-ignore */}
                  <YachtCard yacht={yacht} />
                </ErrorBoundary>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className={styles.yatchBox}>
        <div className={styles.section_head2}>
          Effortless Distribution
        </div>
        <div className={styles.section_head}>
          Seamless Yacht Distribution Solutions
        </div>
        <div className={`${styles.gridBox} ${styles.solutionsGrid}`}>
          {solutionData.map((solution) => (
            <SolutionCard
              key={solution.id}
              heading={solution.heading}
              subheading={solution.subheading}
            />
          ))}
        </div>
        <div className={styles.solutionsSlider}>
          <Swiper
            modules={[Autoplay]}
            slidesPerView="auto"
            spaceBetween={16}
            loop={true}
            autoplay={{ delay: 2200, disableOnInteraction: false, pauseOnMouseEnter: true }}
            style={{ padding: "20px 0", width: "100%" }}
          >
            {solutionData.map((solution) => (
              <SwiperSlide key={solution.id} className={styles.solution_swiper_slide}>
                <SolutionCard
                  heading={solution.heading}
                  subheading={solution.subheading}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className={styles.yatchBox}>
        <div className={styles.section_head}>
          Exclusive Yacht Rentals for Events
        </div>
        <div className={styles.yatch_slider}>
          <Swiper
            spaceBetween={50}
            slidesPerView="auto"
            pagination={{ clickable: true }}
            style={{
              padding: "20px 0",
              width: "100%",
            }}
            breakpoints={{
              320: {
                slidesPerView: "auto",
                spaceBetween: 10
              },
              480: {
                slidesPerView: "auto",
                spaceBetween: 15
              },
              768: {
                slidesPerView: "auto",
                spaceBetween: 20
              },
              1024: {
                slidesPerView: "auto",
                spaceBetween: 40
              }
            }}
          >
            {eventData.map((event) => (
              <SwiperSlide key={event.id} className={styles.swiper_slide}>
                <EventCard imgUrl={event.imgUrl} event={event.event} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Home;
