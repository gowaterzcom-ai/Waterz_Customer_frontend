import React from "react";
import styles from "../../styles/Booking/Booking.module.css";
import Y2 from "../../assets/Yatch/Y2.svg";
import BookedCard from "../Layouts/BookedCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { bookingAPI } from "../../api/bookingApi";
import { useAppDispatch } from "../../redux/store/hook";
import { toast } from "react-toastify";
import { setLoading } from "../../redux/slices/loadingSlice";
interface BookingType {
  _id: string;
  name: string;
  capacity: number;
  startDate: string;
  images: string[];
}
const Booking: React.FC = () => {
  const [currentBookings, setCurrentBookings] = useState<BookingType[]>([]);
  const [previousBookings, setPreviousBookings] = useState<BookingType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        dispatch(setLoading(true));
        const current = await bookingAPI.getCurrentBookings();
        const previous = await bookingAPI.getPreviousBookings();
        console.log("CURRENT DATA IS HERE :",current);
        console.log("PREVIOUS DATA IS HERE :",previous);
        // Validate data before setting state
        if (Array.isArray(current)) {
          setCurrentBookings(current);
        }
        if (Array.isArray(previous)) {
          setPreviousBookings(previous);
        }
      } catch (err: any) {
        dispatch(setLoading(false));
        setError(err?.message || 'Failed to fetch bookings');
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchBookings();
  }, []);

  if (error) {
    toast.error("Something Wrong Happened")
  }
  
  if (!currentBookings || !previousBookings) {
    return <div className={styles.error}>No booking data available</div>;
  }

  const NoBookingsMessage = ({ type }: { type: string }) => (
    <div className={styles.noBookings}>
      <p>No {type} bookings available</p>
    </div>
  );

  return (
    <div className={styles.comp_body}>
      <div className={styles.image_box}>
        <img src={Y2} className={styles.Y2} alt="Yacht" />
      </div>
      <div className={styles.hero_left}>
        <div className={styles.hero_head}>
          Book Your Yacht
        </div>
        <Link to="/location">
          <div className={styles.hero_btn}>
            Start Now
          </div>
        </Link>
      </div>
      <div className={styles.yatchBox}>
        <div className={styles.section_head2}>My bookings</div>
        <div className={styles.section_head}>Current Bookings</div>
        <div className={styles.yatch_slider}>
          {currentBookings.length === 0 ? (
            <NoBookingsMessage type="current" />
          ) : (
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
              {currentBookings.map((booking) => (
                <SwiperSlide key={booking._id}  className={styles.swiper_slide}>
                  <BookedCard
                    name={booking.name}
                    capacity={booking.capacity}
                    startDate={booking.startDate}
                    images={booking.images[0]}
                    bookingId={booking._id}
                    booking={booking}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
      <div className={styles.yatchBox}>
        <div className={styles.section_head}>Previous Bookings</div>
        <div className={styles.yatch_slider}>
          {previousBookings.length === 0 ? (
            <NoBookingsMessage type="previous" />
          ) : (
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
              {previousBookings.map((booking) => (
                <SwiperSlide key={booking._id} className={styles.swiper_slide}>
                  <BookedCard
                    name={booking.name}
                    capacity={booking.capacity}
                    startDate={booking.startDate}
                    images={booking.images[0]}
                    bookingId={booking._id}
                    booking={booking}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;