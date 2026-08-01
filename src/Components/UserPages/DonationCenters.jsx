import { useEffect, useState } from "react";
import "../../App.css";
import "./DonationCenters.css";

function DonationCenters() {
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
  });

  // 🔥 Confirm booking
  const handleConfirm = () => {
    if (!userData.name || !userData.phone) {
      alert("Please fill all details ❌");
      return;
    }

    alert(
      `Booking Confirmed ✅\nCenter: ${selectedCenter.name}\nName: ${userData.name}\nPhone: ${userData.phone}`
    );

    setUserData({ name: "", phone: "" });
    setSelectedCenter(null);
  };

  useEffect(() => {
  // 🔴 Step 1: Check Google loaded
  if (!window.google || !window.google.maps) {
    console.error("Google Maps not loaded ❌");
    return;
  }

  const defaultLocation = { lat: 17.3850, lng: 78.4867 };

  // 🔴 Step 2: Create Map
  const map = new window.google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 13,
  });

  // 🔴 Step 3: Search function
  const searchPlaces = (location) => {
    const service = new window.google.maps.places.PlacesService(map);

    service.nearbySearch(
      {
        location: location,
        radius: 5000,
        keyword: "blood donation OR hospital OR medical store",
      },
      (results, status) => {
        console.log("STATUS:", status);   // 🔥 DEBUG
        console.log("RESULTS:", results); // 🔥 DEBUG

        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          results.forEach((place) => {

            // 🔴 Step 4: Marker add chey
            const marker = new window.google.maps.Marker({
              map,
              position: place.geometry.location,
              title: place.name,
            });

            // 🔴 Step 5: Click event
            marker.addListener("click", () => {
              setSelectedCenter({
                name: place.name,
              });
            });
          });
        }
      }
    );
  };

  // 🔴 Step 6: Location detect
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLoc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        map.setCenter(userLoc);
        searchPlaces(userLoc);
      },
      () => {
        console.warn("Location denied ❌");
        searchPlaces(defaultLocation);
      }
    );
  } else {
    searchPlaces(defaultLocation);
  }

}, []);

  // 🔍 Search real donation centers
  const searchPlaces = (location, map) => {
    const service = new window.google.maps.places.PlacesService(map);

    service.nearbySearch(
      {
        location: location,
        radius: 5000,
        keyword: "blood donation OR hospital OR medical store",
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          results.forEach((place) => {
            const marker = new window.google.maps.Marker({
              map,
              position: place.geometry.location,
              title: place.name,
            });

            marker.addListener("click", () => {
              setSelectedCenter({
                name: place.name,
              });
            });
          });
        }
      }
    );
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Donation Centers</h2>

      {/* ✅ Google Map */}
      <div
        id="map"
        style={{ height: "400px", width: "90%", margin: "auto" }}
      ></div>

      {/* ✅ Popup */}
      {selectedCenter && (
        <div className="popup-box">
          <div className="popup">
            <h3>{selectedCenter.name}</h3>

            <input
              type="text"
              placeholder="Enter your name"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Enter phone number"
              value={userData.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
            />

            <button className="confirm-btn" onClick={handleConfirm}>
              Confirm
            </button>

            <button
              className="cancel-btn"
              onClick={() => setSelectedCenter(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonationCenters;