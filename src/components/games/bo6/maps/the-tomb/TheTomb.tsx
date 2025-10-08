import { MapContainer } from "@/components/core";
import { getBO6MapById } from "@/data/bo6/maps";
import StaffUpgrade from "./sections/StaffUpgrade";

const STEPS = [
  {
    id: "staff-upgrade",
    name: "Staff Upgrade",
    path: "/bo6/the-tomb/staff-upgrade",
    component: StaffUpgrade,
  },
];

function TheTomb() {
  const mapData = getBO6MapById("the-tomb");

  return (
    <MapContainer
      steps={STEPS}
      basePath="/bo6/the-tomb"
      storagePrefix="the-tomb"
      mapName="The Tomb"
      backTo="/bo6"
      className="the-tomb"
      guide={mapData?.guide}
    />
  );
}

export default TheTomb;
