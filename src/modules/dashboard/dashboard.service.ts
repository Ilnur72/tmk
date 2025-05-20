import { Injectable } from '@nestjs/common';

export interface Facility {
  id: number;
  name: string;
  description: string;
}

@Injectable()
export class DashboardService {
  // Data from the screenshot
  private facilities: Facility[] = [
    {
      id: 1,
      name: 'Ингичка вольфрам',
      description: 'бойитиш фабрикасини модернизация қилиш',
    },
    {
      id: 2,
      name: '"Ангрен" ва "Янги Ангрен"',
      description: 'ИЭСларида техноген чиқиндилари (Ангрен)',
    },
    {
      id: 3,
      name: '"Ангрен" ва "Янги Ангрен"',
      description: 'ИЭСларида техноген чиқиндилари (Охангарон)',
    },
    {
      id: 4,
      name: '"Олмалиқ КМК" АЖ "Қолмақир" кони',
      description: 'агдармалари',
    },
    {
      id: 5,
      name: '"Олмалиқ КМК" АЖ қовурчи',
      description: 'сульфат кислотаси техноген чиқиндилари',
    },
    {
      id: 6,
      name: '"Маржонбулоқ" олтин',
      description: 'бойитиш фабрикаси техноген чиқиндилари',
    },
    {
      id: 7,
      name: '"Навоий КМК" АЖ 1-сон',
      description: 'Гидрометаллургия заводи техноген чиқинди майдони',
    },
  ];

  getFacilities(): Facility[] {
    return this.facilities;
  }

  getFacilityById(id: number): Facility {
    return this.facilities.find((facility) => facility.id === id);
  }
}
