import { useState } from "react";
import { useGeolocated } from "react-geolocated";

import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";

function App() {
  const [name, setName] = useState("");
  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

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
    <p>Your browser does not support Geolocation</p>
  ) : !isGeolocationEnabled ? (
    <p>Geolocation is not enabled</p>
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
          disabled={!name && !coords}
        >
          Download
        </Button>
      </div>
    </main>
  ) : (
    <p>Getting the location data&hellip; </p>
  );
}

export default App;
