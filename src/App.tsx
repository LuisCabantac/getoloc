import { useState, useEffect } from "react";
import { useGeolocated } from "react-geolocated";

import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";

function App() {
  const [name, setName] = useState("");
  const [locationError, setLocationError] = useState("");

  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 10000,
      suppressLocationOnMount: false,
      watchPosition: true,
      watchLocationPermissionChange: true,
      onError: (positionError) => {
        console.error("Geolocation error:", positionError);
        if (positionError) {
          if (positionError.code === 1) {
            setLocationError(
              "Location permission denied. Please enable location access in your browser settings."
            );
          } else if (positionError.code === 2) {
            setLocationError(
              "Location information unavailable. Please try again."
            );
          } else if (positionError.code === 3) {
            setLocationError("Location request timed out. Please try again.");
          } else {
            setLocationError("Unknown error occurred getting location.");
          }
        }
      },
    });

  useEffect(() => {
    if (isGeolocationEnabled) {
      setLocationError("");
    }
  }, [isGeolocationEnabled]);

  const handleFileDownload = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [
        `
${name}

Latitude:
${coords?.latitude}

Longitude:
${coords?.longitude}

Altitude:
${coords?.altitude}

`,
      ],
      {
        type: "text/plain",
      }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${name.replace(/[\\/:*?"<>|]/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return !isGeolocationAvailable ? (
    <p className="mx-auto my-6 max-w-2xl px-6 flex justify-center items-center h-dvh">
      Your browser does not support Geolocation
    </p>
  ) : !isGeolocationEnabled ? (
    <div className="mx-auto my-6 max-w-2xl px-6 flex flex-col justify-center items-center h-dvh gap-4">
      <p>Geolocation is not enabled</p>
      {locationError && (
        <p className="text-red-500 text-center">{locationError}</p>
      )}
      <Button onClick={() => getPosition()} className="rounded-full">
        Enable Location Access
      </Button>
    </div>
  ) : coords ? (
    <main className="mx-auto my-6 max-w-2xl px-6 flex justify-center items-center h-dvh">
      <div className="grid gap-4 md:w-3xl">
        <div className="grid gap-2">
          <Label>Name</Label>
          <Input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label>Latitude</Label>
          <Input type="text" value={coords?.latitude ?? ""} />
        </div>
        <div className="grid gap-2">
          <Label>Longitude</Label>
          <Input type="text" value={coords?.longitude ?? ""} />
        </div>
        <div className="grid gap-2">
          <Label>Altitude</Label>
          <Input type="text" value={coords?.altitude ?? ""} />
        </div>
        <Button
          onClick={() => {
            getPosition();
          }}
          className="rounded-full"
        >
          Get Current
        </Button>
        <Button
          variant="outline"
          className="rounded-full disabled:cursor-not-allowed"
          onClick={handleFileDownload}
          disabled={!name.length || !coords}
        >
          Download
        </Button>
      </div>
    </main>
  ) : (
    <div className="mx-auto my-6 max-w-2xl px-6 flex flex-col justify-center items-center h-dvh gap-4">
      <p>Getting the location data&hellip;</p>
      {locationError && (
        <p className="text-red-500 text-center">{locationError}</p>
      )}
      <Button onClick={() => getPosition()} className="rounded-full">
        Retry Getting Location
      </Button>
    </div>
  );
}

export default App;
