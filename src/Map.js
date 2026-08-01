import { useEffect } from "react";

function Map() {
  useEffect(() => {
    // ✅ Create map
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 17.3850, lng: 78.4867 },
      zoom: 12,
    });

    // ✅ Fetch centers from backend
    fetch("http://127.0.0.1:8000/api/all-centers/")
      .then(res => res.json())
      .then(data => {
        console.log("Centers:", data);

        // ✅ Loop and create markers
        data.forEach(center => {
          if (center.latitude && center.longitude) {
            new window.google.maps.Marker({
              position: {
                lat: parseFloat(center.latitude),
                lng: parseFloat(center.longitude),
              },
              map: map,
              title: center.center_name,
            });
          }
        });
      })
      .catch(err => console.log(err));

  }, []);

  return (
    <div
      id="map"
      style={{ height: "500px", width: "100%" }}
    ></div>
  );
}

export default Map;