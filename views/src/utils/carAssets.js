import gt3 from "../assets/images/GT3_RS.avif";
import macan from "../assets/images/Macan.avif";
import taycan from "../assets/images/Taycan.avif";
import carrera from "../assets/images/911_Carrera.avif";
import turbo from "../assets/images/Turbo_S.avif";
import macanElectric from "../assets/images/Macan_Electric.avif";
import macanGts from "../assets/images/Macan_GTS.avif";
import macanTurboElectric from "../assets/images/Macan_TurboE.avif";
import targa from "../assets/images/Targa_4GTS.avif";

const fallbackByName = {
  "911 GT3 RS": gt3,
  Taycan: taycan,
  Macan: macan,
  "911 Carrera": carrera,
  "Taycan Turbo S": taycan,
  "Macan Electric": macanElectric,
  "Macan GTS": macanGts,
  "Macan Turbo Electric": macanTurboElectric,
  "911 Targa 4 GTS": targa,
  "911 Turbo S Cabriolet": turbo,
};

const fallbackByCategory = {
  Sports: gt3,
  Electric: taycan,
  SUV: macan,
  Sedan: carrera,
  Coupe: turbo,
};

export function getCarFallbackImage(car) {
  if (!car) {
    return gt3;
  }

  return car.image || fallbackByName[car.name] || fallbackByCategory[car.category] || gt3;
}
