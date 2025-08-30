import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../../styles/Booking/BookingDetails.module.css";
// import Y2 from "../../assets/Yatch/Y2.svg";
import { yachtAPI } from "../../api/yachts";
import { useLocation, useNavigate } from "react-router-dom";
import { Yacht } from "../../types/yachts";
import { motion, AnimatePresence } from 'framer-motion';

interface FormData {
  startDate: Date | null;
  startTime: Date | null;
  location: string;
  YachtType: string;
  capacity: number;
  PeopleNo: string;
  addonServices: string[];
  packages: string;
  specialRequest: string;
  yacht: string;
}

interface PriceCalculation {
  addonServicesTotal: number;
  packageTotal: number;
  totalPrice: number;
}

const BookingDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { yachtId } = location.state || {};

  const [yachtData, setYachtData] = useState<Yacht | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [priceDetails, setPriceDetails] = useState<PriceCalculation>({
    addonServicesTotal: 0,
    packageTotal: 0,
    totalPrice: 0,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  

  const [isPeak, setIsPeak] = useState(true);

  // NEW: State for available time slots from backend
  const [availableTimeSlots, setAvailableTimeSlots] = useState<any[]>([]);

  const isWithinWorkingHours = (timeStr: string): boolean => {
    // Expecting the format "HH:MM AM/PM" (e.g., "11:00 AM")
    const [time, period] = timeStr.trim().split(" ");
    if (!time || !period) {
      throw new Error("Invalid time format. Expected format 'HH:MM AM/PM'");
    }

    const [hourStr, minuteStr] = time.split(":");
    let hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);

    // Convert to 24-hour format
    if (period.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    }
    if (period.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    // Calculate total minutes from midnight for the input time
    const totalMinutes = hours * 60 + minutes;

    // Define the working hours range in minutes (8:00 AM to 5:00 PM)
    const startMinutes = 8 * 60; // 480 minutes (8:00 AM)
    const endMinutes = 17 * 60;  // 1020 minutes (5:00 PM)

    return totalMinutes >= startMinutes && totalMinutes < endMinutes;
  };

  const [formData, setFormData] = useState<FormData>({
    startDate: new Date(),
    startTime: new Date(),
    location: "",
    YachtType: "",
    capacity: 0,
    PeopleNo: "",
    addonServices: [],
    packages: "",
    specialRequest: "",
    yacht: yachtId || "",
  });

  useEffect(() => {
    if (formData.startTime) {
      // Convert the startTime Date to a string in the format "h:mm aa"
      const options: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      const timeStr = formData.startTime.toLocaleTimeString("en-US", options);
      // If the time is within working hours (non-peak), then isPeak should be false.
      setIsPeak(!isWithinWorkingHours(timeStr));
    }
  }, [formData.startTime]);

  useEffect(() => {
    const fetchYachtData = async () => {
      try {
        const response = await yachtAPI.getYachtById(yachtId);
        // @ts-ignore
        const yacht = response.yatch;
        setYachtData(yacht);
        // Pre-fill some form fields with yacht data
        setFormData((prev) => ({
          ...prev,
          location: yacht.location,
          YachtType: yacht.YachtType,
          capacity: yacht.capacity,
        }));
      } catch (error) {
        setError("Failed to fetch yacht details");
        console.error("Error fetching yacht data:", error);
      }
    };

    if (yachtId) {
      fetchYachtData();
    }
  }, [yachtId]);

  // Convert addon services to Select options
  const addonServicesOptions =
    yachtData?.addonServices.map((service) => ({
      value: service.service,
      label: `${service.service} (₹${service.pricePerHour})`,
      price: service.pricePerHour,
    })) || [];

  // Advance the slide every 3 seconds
  useEffect(() => {
    if (!yachtData?.images?.length) return;
    const handle = setInterval(() => {
      setCurrentIndex(prev =>
        prev === yachtData.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(handle);
  }, [yachtData?.images]);

  // Convert package types to Select options
  const packagesOptions = yachtData?.packageTypes.map(packageType => {
    // Use regex to extract sailing and anchoring times
    const sailingMatch = packageType.match(/^([\d.]+)_hours?_sailing/);
    const anchoringMatch = packageType.match(/([\d.]+)_hours?_anchorage$/);
    
    const sailingTime = sailingMatch ? parseFloat(sailingMatch[1]) : 0;
    const anchoringTime = anchoringMatch ? parseFloat(anchoringMatch[1]) : 0;
    
    const sailingPrice = isPeak ? yachtData.price.sailing.peakTime * sailingTime : yachtData.price.sailing.nonPeakTime * sailingTime;
    const anchoringPrice = isPeak ? yachtData.price.anchoring.peakTime * anchoringTime : yachtData.price.anchoring.nonPeakTime * anchoringTime;
    const totalPrice = sailingPrice + anchoringPrice;
    
    console.log("sailing", sailingPrice);
    console.log("anchoring", anchoringPrice);
  
    return {
      value: packageType,
      label: `${sailingTime} hours sailing + ${anchoringTime} hour anchorage (₹${totalPrice})`,
      price: totalPrice
    };
  }) || [];

  // Custom styles for react-select
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: "40px",
      backgroundColor: "#f5f5f5",
      border: "none",
      borderRadius: "8px",
      boxShadow: "none",
      padding: "7px",
      fontSize: "18px",
    }),
  };

  // Handler for single select fields
  const handleSingleSelect = (
    selectedOption: { value: string; label: string; price?: number } | null,
    field: keyof FormData
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOption ? selectedOption.value : "",
    }));

    // Update price calculation for packages
    if (field === "packages") {
      // Use 0 as default if price is undefined
      const packagePrice = selectedOption?.price ?? 0;

      setPriceDetails((prev) => ({
        ...prev,
        packageTotal: packagePrice,
        totalPrice: packagePrice + prev.addonServicesTotal,
      }));
    }
  };

  // Handler for multi-select fields (addonServices)
  const handleMultiSelect = (
    selectedOptions: readonly { value: string; label: string; price?: number }[],
    field: keyof FormData
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOptions.map((option) => option.value),
    }));

    // Calculate total price for addon services
    const addonTotal = selectedOptions.reduce((total, option) => {
      return total + (option.price || 0);
    }, 0);

    setPriceDetails((prev) => ({
      ...prev,
      addonServicesTotal: addonTotal,
      totalPrice: addonTotal + prev.packageTotal,
    }));
  };

      const parsePackageDuration = (packageStr: string) => {
      if (!packageStr) return { total: 0, sailing: 0, anchorage: 0 };
    
      const lowercaseStr = packageStr.toLowerCase();
      
      // now match 1, 1.5, 2.5, etc.
      const sailingMatch   = lowercaseStr.match(/(\d+(?:\.\d+)?)_hours?_sailing/);
      const anchorageMatch = lowercaseStr.match(/(\d+(?:\.\d+)?)_hours?_anchorage/);
      
      const sailingHours   = sailingMatch   ? parseFloat(sailingMatch[1])   : 0;
      const anchorageHours = anchorageMatch ? parseFloat(anchorageMatch[1]) : 0;
      
      return {
        total:     sailingHours + anchorageHours
      };
    };


  // NEW: useEffect to fetch available time slots from backend when startDate changes
  // useEffect(() => {
  //   const fetchSlots = async () => {
  //     if (formData.startDate && formData.packages && yachtId ) {
  //       try {

  //         const startDate = new Date(formData.startDate);
  //         // Convert to ISO string and manually replace 'Z' with '+00:00'
  //         const formattedStartDate = startDate.toISOString().replace('Z', '+00:00');
  //         console.log("Formatted UTC ISO Date:", formattedStartDate);

          
  //         const duration = parsePackageDuration(formData.packages);
  //         const totalDuration = duration.total || 0;
  //         console.log("totalDuration", totalDuration);
  //         // console.log("startDate", formData.startDate);
  //         // const year = formData.startDate.getFullYear();
  //         // const month = String(formData.startDate.getMonth() + 1).padStart(2, "0");
  //         // const day = String(formData.startDate.getDate()).padStart(2, "0");
  //         // const formattedDate = `${year}-${month}-${day}`;
  //         const response = await yachtAPI.getBookingSlots(yachtId, formattedStartDate, totalDuration);
  //         console.log("availableTimeSlots", response);
  //         //@ts-ignore
  //         setAvailableTimeSlots(response || []);

  //       } catch (error) {
  //         console.error("Error fetching available time slots:", error);
  //       }
  //     }
  //   };
  //   fetchSlots();
  // }, [formData.startDate, yachtId, formData.packages]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!formData.startDate || !formData.packages || !yachtId) return;
  
      try {
        // 1. Extract only the Y/M/D from the selected Date
        const selected = formData.startDate;
        const year  = selected.getFullYear();
        const month = selected.getMonth();    // zero-based
        const day   = selected.getDate();
  
        // 2. Build a new Date at UTC-midnight of that day
        const utcMidnight = new Date(Date.UTC(year, month, day, 0, 0, 0));
  
        // 3. Format into the “YYYY-MM-DDT00:00:00.000+00:00” form
        const formattedStartDate = utcMidnight
          .toISOString()        // e.g. "2025-05-31T00:00:00.000Z"
          .replace("Z", "+00:00");
  
        console.log("Looking up slots for UTC date:", formattedStartDate);
  
        // 4. Compute totalDuration as before
        const duration = parsePackageDuration(formData.packages);
        const totalDuration = duration.total || 0;
  
        // 5. Call your API
        const response = await yachtAPI.getBookingSlots(
          yachtId,
          formattedStartDate,
          totalDuration
        );
        // @ts-ignore
        setAvailableTimeSlots(response || []);
      } catch (error) {
        console.error("Error fetching available time slots:", error);
      }
    };
  
    fetchSlots();
  }, [formData.startDate, formData.packages, yachtId]);


  const handleSubmit = async () => {
    setError("");
    try {
      setIsLoading(true);
      const year = formData.startDate ? formData.startDate.getFullYear() : "";
      const month = formData.startDate
        ? String(formData.startDate.getMonth() + 1).padStart(2, "0")
        : "";
      const day = formData.startDate ? String(formData.startDate.getDate()).padStart(2, "0") : "";
      const formattedDate = formData.startDate ? `${year}-${month}-${day}` : "";

      const hours = formData.startTime
        ? formData.startTime.getHours().toString().padStart(2, "0")
        : "";
      const minutes = formData.startTime
        ? formData.startTime.getMinutes().toString().padStart(2, "0")
        : "";
      const formattedTime = `${hours}:${minutes}`;

      const formattedData = {
        ...formData,
        startDate: formattedDate,
        startTime: formattedTime,
        totalPrice: priceDetails.totalPrice,
      };

      // @ts-ignore
      const response = await yachtAPI.bookYacht(formattedData);
      if (response) {
        navigate("/to-pay", {
          state: {
            // @ts-ignore
            bookingDetails: response.booking,
            pricingDetail: response,
            // @ts-ignore
            orderId: response.orderId,
            packageTotal: priceDetails.packageTotal,
            addonServicesTotal: priceDetails.addonServicesTotal,
            yacht: yachtData,
          },
        });
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to book yacht. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!yachtData) {
    return <div>Loading yacht details...</div>;
  }

  return (
    <div className={styles.comp_body}>
      <div className={styles.yatchBox}>
        <div className={styles.section_head}>Step Closer to Your Yacht Adventure</div>
        <div className={styles.section_head2}>
          Complete your booking in just a few clicks & get ready for an unforgettable experience!
        </div>
      </div>
      <div
        className={styles.image_box}
        style={{ overflow: 'hidden', position: 'relative' }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={yachtData.images[currentIndex]}
            src={yachtData.images[currentIndex]}
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
      <div className={styles.yatchBox}>
        <div className={styles.section_head}>{yachtData.name || "Luxury Yacht"}</div>
        <div className={styles.section_head2}>
          Please select Data and Package to get the available time slots
        </div>
      </div>
      <div className={styles.location_filt_box}>
        <div className={styles.form_grid}>

          {/* Start Date */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Start Date*</label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, startDate: date }))
              }
              minDate={new Date()}
              className={styles.date_picker}
              dateFormat="MM/dd/yyyy"
            />
          </div>

          {/* Packages */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Packages*</label>
            <Select
              options={packagesOptions}
              styles={selectStyles}
              value={
                packagesOptions.find((option) => option.value === formData.packages) ||
                null
              }
              onChange={(value) => handleSingleSelect(value, "packages")}
            />
          </div>


          {/* NEW: Start Time using available slots from backend */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Start Time*</label>
            {formData.startDate && formData.packages ?
              <>
              {availableTimeSlots.length > 0 ? (
                <div className={styles.time_slots}>
                  {availableTimeSlots.map((slot, index) => {
                    const slotStart = new Date(slot.startTime);
                    const slotEnd = new Date(slot.endTime);
                    const formattedStart = slotStart.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    });
                    const formattedEnd = slotEnd.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    });
                    return (
                      <button
                        key={index}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, startTime: slotStart }))
                        }
                        style={{
                          margin: "0 5px",
                          padding: "8px 0",
                          backgroundColor:
                            formData.startTime &&
                            formData.startTime.getTime() === slotStart.getTime()
                              ? "#007BFF"
                              : "#f5f5f5",
                          color:
                            formData.startTime &&
                            formData.startTime.getTime() === slotStart.getTime()
                              ? "#fff"
                              : "#000",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          width: "90%",
                        }}
                      >
                        {formattedStart} - {formattedEnd}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.form_input2}>Not available</div>
              )} </> : 
              <div className={styles.form_input3}>Select Time</div>
            }
          </div>

          {/* Location (Read-only) */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Location</label>
            <input
              type="text"
              className={styles.form_input}
              value={yachtData.location}
              disabled
            />
          </div>

          {/* Yacht Type (Read-only) */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Yacht Type</label>
            <input
              type="text"
              className={styles.form_input}
              value={yachtData.YachtType}
              disabled
            />
          </div>

          {/* Yacht Capacity (Read-only) */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Yacht Capacity</label>
            <input
              type="number"
              className={styles.form_input}
              value={yachtData.capacity}
              disabled
            />
          </div>

          {/* Number of People */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Number of People*</label>
            <input
              type="number"
              min="1"
              max={yachtData.capacity}
              className={styles.form_input}
              placeholder="Enter number of people"
              value={formData.PeopleNo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, PeopleNo: e.target.value }))
              }
            />
          </div>

          {/* Addon Services */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Addon Services</label>
            <Select
              options={addonServicesOptions}
              styles={selectStyles}
              isMulti
              value={addonServicesOptions.filter((option) =>
                formData.addonServices.includes(option.value)
              )}
              onChange={(value) => handleMultiSelect(value, "addonServices")}
            />
          </div>

          {/* Packages
          <div className={styles.form_group}>
            <label className={styles.form_label}>Packages*</label>
            <Select
              options={packagesOptions}
              styles={selectStyles}
              value={
                packagesOptions.find((option) => option.value === formData.packages) ||
                null
              }
              onChange={(value) => handleSingleSelect(value, "packages")}
            />
          </div> */}
        </div>

        <button
          onClick={handleSubmit}
          className={styles.submit_button}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Confirm & Continue"}
        </button>
        {error && <div className={styles.error_message}>{error}</div>}
      </div>
    </div>
  );
};

export default BookingDetails;