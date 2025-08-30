import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from "../../styles/YachtDetails/YachtDetails.module.css";

// Constant details that don't change between yacht
const constantDetails = {
  schedule: [
    {
      time: "15 Minutes",
      description:
        "Arrive at the designated starting point as per location as instructed by the captain. Safety instructions prior to departure."
    },
    {
      time: "15 Minutes",
      description:
        "The yacht journey is anchored away from the shore. You'll be taken to a serene natural spot."
    },
    {
      time: "15 Minutes",
      description:
        "Conclude your journey with a scenic return yacht ride back to the shore."
    }
  ],
  guidelines: [
    {
      title: "Swimming Not Required",
      content:
        "Life jackets are provided, so swimming skills are not mandatory."
    },
    {
      title: "Weather Preparedness",
      content:
        "Sailing depends on wind, tides, and clear conditions, which may cause slight schedule and route changes."
    },
    {
      title: "Advisory Cancellations",
      content:
        "Trips from Gateway of India can be canceled by authorities; pre-payment is refundable or re-scheduled."
    },
    {
      title: "Stop Policy",
      content: "Wind-up time is included in your tour time."
    },
    {
      title: "Respect Policy",
      content:
        "Weather changes during the trip may need your cooperation."
    }
  ],
  faqs: [
    {
      question: "Do you provide catering or food on the boat?",
      answer:
        "No, we provide snacks and soft drinks without other personal requests. You are allowed to carry your own food and soft drinks or water. (We recommend sweet yogurt as a complimentary by Goa)."
    },
    {
      question: "Can I add decorations like balloons, or cake on board?",
      answer: "Yes. All private yacht decorations can be directly availed."
    },
    {
      question: "Can you make special arrangements for birthdays/anniversaries?",
      answer:
        "Yes. We have an optional arrangement service. Make sure you confirm answers early by contacting our staff."
    },
    {
      question:
        "Is it a fixed location tour and will I describe the tour on my own?",
      answer:
        "Yes. It is included and can be based on healthy weather discovery material that you may want to try!"
    }
  ],
  cancellationPolicy: {
    private:
      "A refund is allowed if the booking is canceled due to unforeseeable weather, technical issues, or security protocols.",
    customer:
      "No refunds will be provided for cancellations made by the customer."
  }
};

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // @ts-ignore
  const location = useLocation<{ yacht?: any }>();
  const navigate = useNavigate();
  const yacht = location.state?.yacht;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Advance the slide every 3 seconds
  useEffect(() => {
    if (!yacht?.images?.length) return;
    const handle = setInterval(() => {
      setCurrentIndex(prev =>
        prev === yacht.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(handle);
  }, [yacht?.images]);

  if (!yacht) {
    return <div>Yacht not found</div>;
  }

  // Helper to prettify package type 
  function formatPackageType(pkg: string) {
    // Example: 1.5_hours_sailing_0.5_hour_anchorage
    const regex = /^([\d.]+)_hours?_sailing_([\d.]+)_hour?_anchorage$/;
    const match = pkg.match(regex);
    if (match) {
      const sailing = match[1];
      const anchorage = match[2];
      return `${sailing} hour${sailing !== "1" ? "s" : ""} sailing, ${anchorage} hour${anchorage !== "1" ? "s" : ""} anchorage`;
    }
    return pkg.replace(/_/g, " ");
  }

  function capitalize(str: String){
    if(!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleBookNow = () => {
    navigate("/booking-details", {
      state: {
        yachtId: id,
        yachtName: yacht.name,
        yacht
      }
    });
  };

  return (
    <div className={styles.comp_body}>
      <div className={styles.yatchBox}>
        <div className={styles.section_head}>{yacht.name}</div>
        <div className={styles.section_head2}>
          Explore options to craft a unique yachting experience.
        </div>
      </div>

      {/* Image slideshow */}
      <div
        className={styles.image_box}
        style={{ overflow: 'hidden', position: 'relative' }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={yacht.images[currentIndex]}
            src={yacht.images[currentIndex]}
            alt={`Yacht ${currentIndex + 1}`}
            className={styles.Y2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </AnimatePresence>
      </div>

      <div className={styles.yacht_details_box}>
        <div className={styles.details}>

          {/* Pricing Details */}
          <div className={styles.prices}>
            <div className={styles.left}>
              <div className={styles.price_head}>Pricing Details</div>
              <div className={styles.price_box}>
                <div className={styles.pricess}>
                  <div className={styles.price_type}>Sailing Price</div>
                  <div className={styles.price_value}>
                    Peak Time: ₹
                    {yacht.price?.sailing?.peakTime?.toLocaleString() ||
                      'N/A'}{' '}
                    per hour
                  </div>
                  <div className={styles.price_value}>
                    Non Peak Time: ₹
                    {yacht.price?.sailing?.nonPeakTime?.toLocaleString() ||
                      'N/A'}{' '}
                    per hour
                  </div>
                </div>
                <div className={styles.pricess2}>
                  <div className={styles.price_type}>Anchoring Price</div>
                  <div className={styles.price_value}>
                    Peak Time: ₹
                    {yacht.price?.anchoring?.peakTime?.toLocaleString() ||
                      'N/A'}{' '}
                    per hour
                  </div>
                  <div className={styles.price_value}>
                    Non Peak Time: ₹
                    {yacht.price?.anchoring?.nonPeakTime?.toLocaleString() ||
                      'N/A'}{' '}
                    per hour
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.Right}>
              <button
                className={styles.bookButton}
                onClick={handleBookNow}
              >
                Book Now
              </button>
            </div>
          </div>

          {/* Peak & Non-peak Hours */}
          <div className={styles.about}>
            <h3>Peak & Non-peak Hours</h3>
            <p>Peak Hours: 5:00 PM to 8:00 AM</p>
            <p>Non Peak Hours: 8:00 AM to 5:00 PM</p>
          </div>

          {/* About Yacht */}
          <div className={styles.about}>
            <h3>About {yacht.name}</h3>
            <p>{yacht.description}</p>
          </div>

          {/* Packages */}
          <div className={styles.summary}>
            <h3>Available Packages</h3>
            {yacht.packageTypes?.length ? (
              <ul>
                {yacht.packageTypes.map((pkg: string, idx: number) => (
                  <li key={idx}>{formatPackageType(pkg)}</li>
                ))}
              </ul>
            ) : (
              <p>No packages available</p>
            )}
          </div>

          {/* Addon Services */}
          <div className={styles.summary}>
            <h3>Addon Services</h3>
            {yacht.addonServices?.length ? (
              <ul>
                {yacht.addonServices.map((svc: any) => (
                  <li key={svc._id}>
                    {svc.service}: ₹{svc.pricePerHour.toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No addon services available</p>
            )}
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <h3>Summary</h3>
            <p>
              <b>Ideal for:</b> Friends, Family, Couples, Groups, Tourists
            </p>
            <p>
              <b>For:</b> Up to {yacht.capacity} people
            </p>
            <p>
              <b>Location:</b> {capitalize(yacht.location)}
            </p>
            <p>
              <b>Duration:</b> According to preference
            </p>
            {/* <p>
              <b>Note:</b> This is an exclusive private sailing
              experience where the entire yacht is reserved just for you.
            </p> */}
          </div>

          {/* Sailing Schedule */}
          <div className={styles.schedule}>
            <h3>Sailing Schedule</h3>
            <ul>
              {constantDetails.schedule.map((item, idx) => (
                <li key={idx}>
                  <b>{item.time}:</b> {item.description}
                </li>
              ))}
            </ul>
          </div>

          {/* Specifications */}
          <div className={styles.specifications}>
            <h3>Specifications</h3>
            {/* <p>
              <b>Length:</b> {yacht.dimension}
            </p> */}
            <p>
              <b>Passenger Capacity:</b> {yacht.capacity} people
            </p>
            <p>
              <b>Crew:</b> {yacht.crewCount}
            </p>
          </div>

          {/* Meeting Point */}
          {/* <div className={styles.meetingPoint}>
            <h3>Meeting Point Address</h3>
            <p>{yacht.pickupat || formattedLocation}</p>
          </div> */}

          {/* Guidelines */}
          <div className={styles.guidelines}>
            <h3>Important Guidelines</h3>
            <ul>
              {constantDetails.guidelines.map((item, idx) => (
                <li key={idx}>
                  <b>{item.title}:</b> {item.content}
                </li>
              ))}
            </ul>
          </div>

          {/* FAQs */}
          <div className={styles.faqs}>
            <h3>FAQs</h3>
            {constantDetails.faqs.map((faq, idx) => (
              <p key={idx}>
                <b>{faq.question}</b>
                <br />
                {faq.answer}
              </p>
            ))}
          </div>

          {/* Cancellation Policy */}
          <div className={styles.cancellation}>
            <h3>Cancellation & Refund Policy</h3>
            <p>
              <b>Private Cancellations:</b>{" "}
              {constantDetails.cancellationPolicy.private}
            </p>
            <p>
              <b>Customer Cancellations:</b>{" "}
              {constantDetails.cancellationPolicy.customer}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Details;



// import React from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import styles from "../../styles/YachtDetails/YachtDetails.module.css";
// // Constant details that don't change between yachts
// const constantDetails = {
//   schedule: [
//     {
//       time: "15 Minutes",
//       description: "Arrive at the designated starting point as per location as instructed by the captain. Safety instructions prior to departure."
//     },
//     {
//       time: "15 Minutes",
//       description: "The yacht journey is anchored away from the shore. You'll be taken to a serene natural spot."
//     },
//     {
//       time: "15 Minutes",
//       description: "Conclude your journey with a scenic return yacht ride back to the shore."
//     }
//   ],
//   guidelines: [
//     { title: "Swimming Not Required", content: "Life jackets are provided, so swimming skills are not mandatory." },
//     { title: "Weather Preparedness", content: "Sailing depends on wind, tides, and clear conditions, which may cause slight schedule and route changes." },
//     { title: "Advisory Cancellations", content: "Trips from Gateway of India can be canceled by authorities; pre-payment is refundable or re-scheduled." },
//     { title: "Stop Policy", content: "Wind-up time is included in your tour time." },
//     { title: "Respect Policy", content: "Weather changes during the trip may need your cooperation." }
//   ],
//   faqs: [
//     {
//       question: "Do you provide catering or food on the boat?",
//       answer: "No, we provide snacks and soft drinks without other personal requests. You are allowed to carry your own food and soft drinks or water. (We recommend sweet yogurt as a complimentary by Goa)."
//     },
//     {
//       question: "Can I add decorations like balloons, or cake on board?",
//       answer: "Yes. All private yacht decorations can be directly availed."
//     },
//     {
//       question: "Can you make special arrangements for birthdays/anniversaries?",
//       answer: "Yes. We have an optional arrangement service. Make sure you confirm answers early by contacting our staff."
//     },
//     {
//       question: "Is it a fixed location tour and will I describe the tour on my own?",
//       answer: "Yes. It is included and can be based on healthy weather discovery material that you may want to try!"
//     }
//   ],
//   cancellationPolicy: {
//     private: "A refund is allowed if the booking is canceled due to unforeseeable weather, technical issues, or security protocols.",
//     customer: "No refunds will be provided for cancellations made by the customer."
//   }
// };

// const Details: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const yacht = location.state?.yacht;

//   if (!yacht) {
//     return <div>Yacht not found</div>;
//   }

//   // Format the location string based on the type of yacht.location
//   const formattedLocation = typeof yacht.location === 'object' 
//     ? yacht.pickupat || 'Location details available on booking'
//     : yacht.location;

//   const handleBookNow = () => {
//     navigate("/booking-details", {
//       state: {
//         yachtId: id,
//         yachtName: yacht.name,
//         yacht: yacht // Passing the entire yacht object
//       }
//     });
//   };

//   console.log("images", yacht.images);

//   return (
//     <div className={styles.comp_body}>
//       <div className={styles.yatchBox}>
//         <div className={styles.section_head}>{yacht.name}</div>
//         <div className={styles.section_head2}>Explore options to craft a unique yachting experience.</div>
//       </div>
//       <div className={styles.image_box}>
//         <img src={yacht.images[0]} alt="Yacht" className={styles.Y2} />
//       </div>
//       <div className={styles.yacht_details_box}>
//         <div className={styles.details}>
//           {/* Pricing Details */}
//           <div className={styles.prices}>
//             <div className={styles.left}>
//               <div className={styles.price_head}>Pricing Details</div>
//               <div className={styles.price_box}>
//                 <div className={styles.pricess}>
//                   <div className={styles.price_type}>Sailing Price</div>
//                   <div className={styles.price_value}>
//                     Peak Time: ₹{yacht.price?.sailing?.peakTime?.toLocaleString() || 'N/A'} per hour
//                   </div>
//                   <div className={styles.price_value}>
//                     Non Peak Time: ₹{yacht.price?.sailing?.nonPeakTime?.toLocaleString() || 'N/A'} per hour
//                   </div>
//                 </div>
//                 <div className={styles.pricess2}>
//                   <div className={styles.price_type}>Anchoring Price</div>
//                   <div className={styles.price_value}>
//                     Peak Time: ₹{yacht.price?.anchoring?.peakTime?.toLocaleString() || 'N/A'} per hour
//                   </div>
//                   <div className={styles.price_value}>
//                     Non Peak Time: ₹{yacht.price?.anchoring?.nonPeakTime?.toLocaleString() || 'N/A'} per hour
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className={styles.Right}>
//               <button className={styles.bookButton} onClick={handleBookNow}>Book Now</button>
//             </div>
//           </div>

//           {/* About Yacht */}
//           <div className={styles.about}>
//             <h3>Peak & Non-peak Hours</h3>
//             <p>Peak Hours: 5:00 PM to 8:00 AM</p>
//             <p>Non Peak Hours: 8:00 AM to 5:00 PM</p>
//           </div>

//           {/* About Yacht */}
//           <div className={styles.about}>
//             <h3>About {yacht.name}</h3>
//             <p>{yacht.description}</p>
//           </div>



//           {/* Packages */}
//           <div className={styles.summary}>
//             <h3>Available Packages</h3>
//             {yacht.packageTypes && yacht.packageTypes.length > 0 ? (
//               <ul>
//                 {/* @ts-ignore */}
//                 {yacht.packageTypes.map((pkg, index) => (
//                   <li key={index}>{pkg}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No packages available</p>
//             )}
//           </div>

//           {/* Addon Services */}
//           <div className={styles.summary}>
//             <h3>Addon Services</h3>
//             {yacht.addonServices && yacht.addonServices.length > 0 ? (
//               <ul>
//                 {/* @ts-ignore */}
//                 {yacht.addonServices.map(service => (
//                   <li key={service._id}>
//                     {service.service}: ₹{service.pricePerHour.toLocaleString()} 
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No addon services available</p>
//             )}
//           </div>

//         {/* Summary */}
//         <div className={styles.summary}>
//             <h3>Summary</h3>
//             <p><b>Ideal for:</b> Friends, Family, Couples, Groups, Tourists</p>
//             <p><b>For:</b> Up to {yacht.capacity} people</p>
//             <p><b>Where:</b> {formattedLocation}</p>
//             <p><b>Duration:</b> According to preference</p>
//             <p><b>Note:</b> This is an exclusive private sailing experience where the entire yacht is reserved just for you.</p>
//         </div>

//           {/* Sailing Schedule */}
//           <div className={styles.schedule}>
//             <h3>Sailing Schedule</h3>
//             <ul>
//               {constantDetails.schedule.map((item, index) => (
//                 <li key={index}>
//                   <b>{item.time}:</b> {item.description}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Specifications */}
//           <div className={styles.specifications}>
//             <h3>Specifications</h3>
//             <p><b>Length:</b> {yacht.dimension}</p>
//             <p><b>Passenger Capacity:</b> {yacht.capacity} people</p>
//             <p><b>Crew:</b> {yacht.crewCount}</p>
//           </div>

//           {/* Meeting Point */}
//           <div className={styles.meetingPoint}>
//             <h3>Meeting Point Address</h3>
//             <p>{yacht.pickupat || formattedLocation}</p>
//           </div>

//           {/* Guidelines */}
//           <div className={styles.guidelines}>
//             <h3>Important Guidelines</h3>
//             <ul>
//               {constantDetails.guidelines.map((item, index) => (
//                 <li key={index}><b>{item.title}:</b> {item.content}</li>
//               ))}
//             </ul>
//           </div>

//           {/* FAQs */}
//           <div className={styles.faqs}>
//             <h3>FAQs</h3>
//             {constantDetails.faqs.map((faq, index) => (
//               <p key={index}><b>{faq.question}</b><br />{faq.answer}</p>
//             ))}
//           </div>

//           {/* Cancellation Policy */}
//           <div className={styles.cancellation}>
//             <h3>Cancellation & Refund Policy</h3>
//             <p><b>Private Cancellations:</b> {constantDetails.cancellationPolicy.private}</p>
//             <p><b>Customer Cancellations:</b> {constantDetails.cancellationPolicy.customer}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Details;
