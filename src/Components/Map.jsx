import React, { useEffect } from "react";

const Map = () => {

  // ✅ FIRST declare function
  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 17.3850, lng: 78.4867 },
      zoom: 10
    });

    fetch("http://127.0.0.1:8000/api/all-centers/")
      .then(res => res.json())
      .then(data => {
        console.log("Centers:", data);

        data.forEach(center => {
          if (center.latitude && center.longitude) {
            new window.google.maps.Marker({
              position: {
                lat: parseFloat(center.latitude),
                lng: parseFloat(center.longitude)
              },
              map: map,
              title: center.center_name
            });
          }
        });
      })
      .catch(err => console.log(err));
  };

  // ✅ THEN use it
  useEffect(() => {
    initMap();
  }, []);

  return (
    <div>
      <h2>Donation Centers Map</h2>
      <div id="map" style={{ height: "500px", width: "100%" }}></div>
    </div>
  );
};

export default Map;