import type { StudyModule, TopicId } from '../types'
import { TOPIC_IDS } from './topics'

export const STUDY_MODULES: StudyModule[] = [
  {
    topicId: 'regulations',
    title: 'Regulations',
    youtubeVideoId: 'ey1iT204hh8',
    youtubeTitle: 'Commercial Drone Rules Made Easy (Part 107 Overview)',
    youtubeChannel: 'UAV Coach',
    keyPoints: [
      'Part 107 is the FAA rule set for civil small UAS (under 55 lb) used for non-recreational purposes.',
      'A Remote Pilot Certificate with a small UAS rating requires age 16, English, TSA vetting, and a knowledge test (or Part 61 path).',
      'Certificate privileges need aeronautical knowledge recency every 24 calendar months.',
      'Default limits: 87 kt groundspeed, 400 ft AGL (or 400 ft of a structure), 3 SM visibility, 500 ft below clouds.',
      'The remote PIC is final authority, must keep the aircraft in a condition for safe operation, and may not fly impaired.',
      'Waivers exist for listed sections when you show an equivalent level of safety; they are not a blanket “pay to skip the rules.”',
      'Accidents that meet the 107.9 thresholds must be reported to the FAA within 10 days; emergency deviations are reported only if the Administrator asks.',
    ],
    vocabulary: [
      {
        term: 'Small unmanned aircraft',
        definition: 'An unmanned aircraft weighing less than 55 pounds on takeoff, including everything onboard or attached.',
      },
      {
        term: 'Remote PIC',
        definition: 'The person who holds the Remote Pilot Certificate, is directly responsible for the flight, and has final authority.',
      },
      {
        term: 'Certificate of waiver',
        definition: 'FAA authorization to deviate from specific listed Part 107 provisions when the operation can be conducted safely.',
      },
      {
        term: 'Aeronautical knowledge recency',
        definition: 'Training or testing required every 24 calendar months before you may exercise remote PIC privileges.',
      },
      {
        term: 'Remote ID',
        definition: 'Broadcast identification required for most UAS under 14 CFR Part 89 (standard RID, broadcast module, or FRIA).',
      },
      {
        term: 'Condition for safe operation',
        definition: 'The aircraft and systems must be airworthy for the intended flight; if not, you may not operate.',
      },
    ],
    explanation: [
      'Think of Part 107 as three layers: who may fly (certificate and recency), how you may fly (operating limits and PIC duties), and how you get relief (waivers, airspace authorizations, and category-specific over-people rules). The knowledge test is built around those layers, not around memorizing every manufacturer menu.',
      'A common miss is mixing accident reporting with emergency deviation. If someone is seriously injured or property (other than the UA) is damaged over $500, you have a 10-day 107.9 report. If you merely had to break a rule to handle an in-flight emergency, you send a written explanation only when the FAA asks.',
      'Registration (Part 48) and Remote ID (Part 89) sit beside Part 107. Marking and RID do not replace a Remote Pilot Certificate for commercial work, and a certificate does not replace registration or RID when those rules apply.',
    ],
    quiz: [
      {
        id: 'mod-reg-1',
        stem: 'Which set of default Part 107 operating limits is correct unless a waiver or exception applies?',
        choices: [
          '100 mph, 500 ft AGL, 1 SM visibility',
          '87 knots groundspeed, 400 ft AGL, 3 SM visibility, 500 ft below clouds',
          '250 knots, 18,000 ft MSL, IFR only',
          'No speed limit if you stay in Class G',
        ],
        correctIndex: 1,
        explanation:
          '§107.51 sets 87 knots, 400 ft AGL (with the structure exception), 3 SM visibility from the control station, and cloud clearance of 500 ft below. The other numbers mix manned-aircraft or recreational myths.',
        reference: '14 CFR §107.51; ACS UA.I.B.K2',
      },
      {
        id: 'mod-reg-2',
        stem: 'Aeronautical knowledge recency to act as remote PIC is required every:',
        choices: [
          '12 calendar months',
          '24 calendar months',
          '36 calendar months',
          'Only when the plastic certificate expires',
        ],
        correctIndex: 1,
        explanation:
          '§107.65 requires training or testing within the preceding 24 calendar months. The plastic card itself is not a substitute for recency.',
        reference: '14 CFR §107.65; ACS UA.I.A.K2',
      },
      {
        id: 'mod-reg-3',
        stem: 'Carriage of hazardous material on a small UAS under Part 107 is:',
        choices: [
          'Allowed below 400 feet',
          'Generally prohibited',
          'Required for commercial deliveries',
          'Allowed if the PIC holds a CDL',
        ],
        correctIndex: 1,
        explanation:
          '§107.36 prohibits carrying hazardous material. Altitude, commercial purpose, or a driver license does not create an exception.',
        reference: '14 CFR §107.36',
      },
    ],
  },
  {
    topicId: 'airspace',
    title: 'Airspace & flight restrictions',
    youtubeVideoId: '-D0bIfoLkCA',
    youtubeTitle: 'How to Read Sectional Charts | FAA Part 107 Study Guide',
    youtubeChannel: 'Meridian Media',
    keyPoints: [
      'Class B, C, D, and surface Class E require ATC authorization for small UAS (LAANC or FAA DroneZone).',
      'Class G is uncontrolled: no 107.41 authorization, but TFRs, restricted/prohibited areas, and other Part 107 rules still apply.',
      'Sectionals show airspace with blue/magenta lines, airport data blocks, and special-use labels (R, P, MOA, W, A).',
      'UAS Facility Maps show maximum altitudes ATC is likely to authorize in a grid; they are not a license to fly without authorization.',
      'TFRs (stadium, VIP, disaster, security) can close airspace that is otherwise Class G—always check before flight.',
      'Restricted and prohibited areas need the using agency’s permission; MOAs and alert areas warn of military or training activity.',
      'The DC FRZ is not ordinary Class G; civil sUAS operations there are generally prohibited without special authorization.',
    ],
    vocabulary: [
      {
        term: 'LAANC',
        definition: 'Low Altitude Authorization and Notification Capability—near-real-time ATC authorization in many controlled-airspace grids.',
      },
      {
        term: 'UAS Facility Map (UASFM)',
        definition: 'A grid of altitudes used in LAANC that shows where ATC is prepared to authorize small UAS operations.',
      },
      {
        term: 'TFR',
        definition: 'Temporary Flight Restriction published by NOTAM that can prohibit or restrict UAS operations in a defined area.',
      },
      {
        term: 'Restricted area',
        definition: 'Special-use airspace (R-xxx) where operations are hazardous to non-participating aircraft; enter only with using-agency permission when active.',
      },
      {
        term: 'MOA',
        definition: 'Military Operations Area—military training airspace. You may operate, but expect high-speed military traffic.',
      },
      {
        term: 'Class E surface area',
        definition: 'Class E that goes to the surface around some airports (dashed magenta); it is controlled and needs 107.41 authorization.',
      },
    ],
    explanation: [
      'Authorization is about the airspace class, not how close you feel to the airport. If you are inside the Class D ring or under a Class B shelf, you need authorization even at 50 feet AGL. If you are in Class G next door, 107.41 does not apply—but a TFR, park rule, or restricted area still might.',
      'Read the chart first, then the UASFM. The map tells you what altitude ATC might approve; it does not make a grid “Class G.” Combine sectional airspace, NOTAMs, and the facility map before you launch.',
      'Special-use airspace is not all the same. Prohibited means no. Restricted means not without permission when hot. MOAs and alert areas are “know what you are flying into.” Warning areas sit over international waters. Controlled firing areas are not even charted.',
    ],
    quiz: [
      {
        id: 'mod-air-1',
        stem: 'ATC authorization is required to operate a small UAS in which of the following?',
        choices: [
          'Class G in a rural field with no airport',
          'Class D around a towered airport',
          'Any airspace below 100 feet AGL',
          'A Military Operations Area only',
        ],
        correctIndex: 1,
        explanation:
          '§107.41 lists Class B, C, D, and surface Class E. Ordinary Class G does not need ATC authorization. Low altitude does not cancel Class D, and a MOA is special-use, not the 107.41 list.',
        reference: '14 CFR §107.41; ACS UA.II.A.K1',
      },
      {
        id: 'mod-air-2',
        stem: 'A UAS Facility Map grid value is best used as:',
        choices: [
          'A substitute for looking at the sectional',
          'The altitude ATC is generally prepared to authorize in that grid, after you have authorization',
          'A guarantee you may fly in a TFR',
          'The Class A floor',
        ],
        correctIndex: 1,
        explanation:
          'UASFMs support LAANC altitudes. They do not replace chart reading or punch a hole in a TFR, and they have nothing to do with Class A.',
        reference: 'FAA UAS Facility Maps; AC 107-2A; ACS UA.II.A.K2',
      },
      {
        id: 'mod-air-3',
        stem: 'When a VIP or stadium TFR is active over your planned site, you should:',
        choices: [
          'Fly anyway if you stay below 400 feet',
          'Not operate in the restricted area unless the TFR explicitly allows it',
          'Ask a local police officer to waive the TFR',
          'Treat it as Class G',
        ],
        correctIndex: 1,
        explanation:
          'Active TFRs are legally binding. Altitude, local police, and Class G labels do not override a NOTAM that closes the airspace to UAS.',
        reference: '14 CFR §107.47; AIM 3-5-3; ACS UA.II.B.K1',
      },
    ],
  },
  {
    topicId: 'weather',
    title: 'Weather',
    youtubeVideoId: 'OQ2ep9AL91I',
    youtubeTitle: 'Cracking the Weather Code: Essential METAR and TAF Reading Tips for Drone Pilots',
    youtubeChannel: 'Altitude University',
    keyPoints: [
      'Part 107 minima from the control station: 3 SM visibility and 500 ft below clouds (no flight in a cloud).',
      'A METAR is an observation; a TAF is a forecast for an airport terminal area.',
      'Ceiling is the lowest broken (BKN) or overcast (OVC) layer, in hundreds of feet AGL.',
      'Density altitude rises with heat, altitude, and humidity and cuts climb, hover, and endurance.',
      'Thunderstorms, icing, frost, and wind shear are no-go weather for small UAS.',
      'A tight temperature/dew point spread means moisture is likely—fog, low clouds, or reduced visibility.',
      'Read gusts (G), weather codes (BR, FG, TSRA), and TEMPO/PROB groups so you do not plan into a short-lived hazard.',
    ],
    vocabulary: [
      {
        term: 'METAR',
        definition: 'Aviation routine weather report—what the observer or automated station is seeing now (plus remarks).',
      },
      {
        term: 'TAF',
        definition: 'Terminal Aerodrome Forecast—expected conditions at an airport, typically 24–30 hours, with change groups.',
      },
      {
        term: 'Density altitude',
        definition: 'Pressure altitude corrected for nonstandard temperature; the altitude the aircraft “feels” for performance.',
      },
      {
        term: 'Ceiling',
        definition: 'AGL height of the lowest BKN or OVC layer (or vertical visibility into an obscuration).',
      },
      {
        term: 'BR / FG',
        definition: 'Mist (visibility 5/8–6 SM) versus fog (visibility less than 5/8 SM).',
      },
      {
        term: 'TEMPO',
        definition: 'TAF change group: temporary fluctuations expected for less than half the period, each usually under an hour.',
      },
    ],
    explanation: [
      'The test loves mixing observation and forecast. If the question says “current conditions at the airport,” look at a METAR. If it asks what is expected this afternoon, look at the TAF. Visibility and cloud groups on both products are AGL for clouds and statute miles for vis.',
      'Performance weather is density altitude. Hot, high, and humid means less thrust, longer takeoff, weaker climb, and shorter battery life. Frost and ice destroy lift on small props even more dramatically than on a Cessna wing—do not launch with it.',
      'Convective weather is a complete stop. You cannot out-climb a gust front with a multirotor. If a TAF or convective SIGMET mentions thunderstorms, treat that as a mission-killer, not a “maybe if we fly quick.”',
    ],
    quiz: [
      {
        id: 'mod-wx-1',
        stem: 'Part 107 minimum flight visibility, observed from the control station, is:',
        choices: [
          '1 statute mile',
          '2 statute miles',
          '3 statute miles',
          '5 statute miles',
        ],
        correctIndex: 2,
        explanation:
          '§107.51 requires 3 SM visibility from the control station and remaining 500 feet below clouds. One and two miles are common manned VFR numbers that do not apply here.',
        reference: '14 CFR §107.51; ACS UA.III.A.K1',
      },
      {
        id: 'mod-wx-2',
        stem: 'A METAR sky group of “BKN012” means:',
        choices: [
          'Broken clouds at 12,000 feet MSL, not a ceiling',
          'A ceiling of 1,200 feet AGL',
          'Sky clear below 12,000 feet',
          'Fog with 12 SM visibility',
        ],
        correctIndex: 1,
        explanation:
          'Sky heights in METARs are hundreds of feet AGL. BKN is a ceiling, so BKN012 is 1,200 feet AGL broken—not 12,000 MSL.',
        reference: 'AIM 7-1-28; ACS UA.III.A.K2',
      },
      {
        id: 'mod-wx-3',
        stem: 'High density altitude is most associated with which performance change?',
        choices: [
          'Increased hover ceiling and extra endurance',
          'Reduced climb, hover, and propeller/rotor thrust',
          'Automatically legal flight into clouds',
          'Lower true airspeed for the same indicated speed only in Class A',
        ],
        correctIndex: 1,
        explanation:
          'Thinner air cuts thrust and lift. That lowers hover/climb margins and burns energy faster. It does not authorize IMC or apply only in Class A.',
        reference: 'PHAK Chapter 4; ACS UA.III.B.K2',
      },
    ],
  },
  {
    topicId: 'loading-performance',
    title: 'Loading & performance',
    youtubeVideoId: 'd1BBvqtb80o',
    youtubeTitle: 'Center of Gravity, Weight and Balance Explained | FAA Part 107 Exam',
    youtubeChannel: 'Blokhin Films',
    keyPoints: [
      'Stay within manufacturer max weight and CG limits—being under 55 lb is not enough.',
      'Moment = weight × arm; CG = total moment ÷ total weight.',
      'Aft CG tends toward instability; forward CG tends toward sluggish pitch and extra power to hold attitude.',
      'Lateral imbalance makes the aircraft constantly fight roll/yaw and wastes battery.',
      'Density altitude, weight, and wind together set hover, climb, and endurance—plan the worst of the three.',
      'Load factor rises in turns (about 2 G at 60° of bank), increasing stall speed and structural load.',
      'Ground effect can make a heavy aircraft feel fine in a 3-foot hover and then sink when you climb out of it.',
    ],
    vocabulary: [
      {
        term: 'Center of gravity (CG)',
        definition: 'The point where the aircraft would balance; it must stay inside the manufacturer envelope.',
      },
      {
        term: 'Arm',
        definition: 'The distance from a datum to a weight. Used with weight to compute moment.',
      },
      {
        term: 'Useful load',
        definition: 'Weight you may add above empty weight (battery, payload, accessories) up to max takeoff weight.',
      },
      {
        term: 'Load factor',
        definition: 'G-loading; in a level turn it is 1/cos(bank angle).',
      },
      {
        term: 'In-ground effect (IGE)',
        definition: 'Hover or flight close enough to the surface that induced drag decreases and less power is required.',
      },
      {
        term: 'Density altitude',
        definition: 'The performance altitude: high DA means you need more power for the same maneuver.',
      },
    ],
    explanation: [
      'Weight-and-balance questions are arithmetic plus judgment. If you hang a camera off one arm, you moved both the total weight and the lateral CG. If the manual gives a CG range, treat it like a hard limit—not a suggestion.',
      'Performance is a stack. A legal 4-pound payload on a standard day at sea level may be a no-go on a 90 °F mountain site. Check hover capability out of ground effect, not just whether the aircraft left the grass.',
      'Maneuvering has a cost. Aggressive yaw, hard stops, and steep banks raise load factor and current draw. That is how aircraft that “had 40% battery” still fail on the last orbit.',
    ],
    quiz: [
      {
        id: 'mod-lp-1',
        stem: 'If the center of gravity is too far aft, a small UAS is most likely to be:',
        choices: [
          'Unusually stable in pitch',
          'Unstable or difficult to control in pitch',
          'Unaffected, because CG only matters on airplanes',
          'Automatically over max gross weight',
        ],
        correctIndex: 1,
        explanation:
          'Aft CG reduces pitch stability. Multirotors still have a CG envelope. Aft CG is a distribution problem, not automatically an overweight problem.',
        reference: 'PHAK Chapter 10; ACS UA.V.B.K2',
      },
      {
        id: 'mod-lp-2',
        stem: 'Moment used in weight-and-balance is:',
        choices: [
          'Weight × arm',
          'Weight ÷ arm',
          'Max weight − payload',
          'Arm only, in inches',
        ],
        correctIndex: 0,
        explanation:
          'Moment is the turning effect of a weight: weight times its arm. CG is then total moment divided by total weight.',
        reference: 'PHAK Chapter 10; ACS UA.V.B.K1',
      },
      {
        id: 'mod-lp-3',
        stem: 'A coordinated 60° bank level turn produces about how much load factor?',
        choices: ['1 G', '1.15 G', '2 G', '4 G'],
        correctIndex: 2,
        explanation:
          'Load factor = 1/cos(60°) = 2. Forty-five degrees is about 1.4 G. Four G is a much steeper bank.',
        reference: 'PHAK Chapter 5; ACS UA.IV.A.K8',
      },
    ],
  },
  {
    topicId: 'operations-emergency',
    title: 'Operations & emergency procedures',
    youtubeVideoId: '6P-bOpUvX28',
    youtubeTitle: 'Night Flying Rules for Part 107 Pilots (PLUS 13 Night Questions & My Favorite Beacon!)',
    youtubeChannel: 'John Peltier',
    keyPoints: [
      'VLOS: the PIC or a VO must be able to see the UA unaided (corrective lenses OK) well enough to maneuver and yield.',
      'Yield to all manned aircraft. Sensors and LAANC do not provide separation.',
      'One small UA at a time per PIC unless you have a waiver.',
      'Night and civil twilight require anti-collision lights visible 3 SM; intensity may be reduced if needed for safety.',
      'Lost link: follow the predetermined failsafe (RTH, hover, or land) you verified at preflight; keep eyes on the aircraft.',
      'In an emergency you may deviate from Part 107 to the extent necessary; a written report is due if the FAA requests it.',
      'Over people and over moving vehicles are category-limited—do not treat a city street as an open flyover.',
    ],
    vocabulary: [
      {
        term: 'VLOS',
        definition: 'Visual line of sight with unaided vision (corrective lenses allowed) so you can see the UA and scan for traffic.',
      },
      {
        term: 'Visual observer (VO)',
        definition: 'A person who scans for traffic and hazards and stays in real-time communication with the remote PIC.',
      },
      {
        term: 'Lost link',
        definition: 'Loss of the command-and-control connection; the aircraft should follow a pre-briefed failsafe.',
      },
      {
        term: 'Civil twilight',
        definition: 'The 30 minutes before sunrise and after sunset, when anti-collision lighting is required like night.',
      },
      {
        term: 'Flyaway',
        definition: 'Uncontrolled flight away from the PIC; treat as an emergency, note last position/altitude/heading, notify ATC if a hazard to aviation.',
      },
      {
        term: 'Category 1 over people',
        definition: 'Typically ≤ 0.55 lb on takeoff and no exposed rotating parts that could lacerate skin.',
      },
    ],
    explanation: [
      'Operations questions are about who is looking and who is in charge. FPV goggles do not satisfy VLOS by themselves. A VO does not become PIC. Brief the crew on who scans, who flies, and what happens if the video dies.',
      'Night is no longer a default waiver item, but it is equipment- and knowledge-dependent. Lights must be visible 3 SM. Dim them only when the PIC decides that is safer (for example, to protect night vision), not because they are annoying.',
      'Emergencies are planned in advance. Know whether RTH climbs through traffic, whether the home point is still valid, and who you will call if the aircraft heads toward an airport. Deviation authority in 107.21 is not a license to keep flying an unsafe aircraft.',
    ],
    quiz: [
      {
        id: 'mod-ops-1',
        stem: 'Night small UAS anti-collision lights must be visible for at least:',
        choices: ['1 SM', '3 SM', '5 SM', '10 SM'],
        correctIndex: 1,
        explanation:
          '§107.29 requires anti-collision lighting visible for at least 3 statute miles. The PIC may reduce intensity if necessary for safety.',
        reference: '14 CFR §107.29; ACS UA.IV.A.K4',
      },
      {
        id: 'mod-ops-2',
        stem: 'First-person-view goggles may be used during a Part 107 flight when:',
        choices: [
          'They replace VLOS completely',
          'The remote PIC or a visual observer still maintains unaided visual line of sight of the UA',
          'The aircraft weighs less than 0.55 pounds',
          'You are inside Class B',
        ],
        correctIndex: 1,
        explanation:
          'Someone must keep unaided VLOS. FPV is extra, not a substitute. Weight and airspace class do not change that.',
        reference: '14 CFR §107.31; AC 107-2A; ACS UA.IV.A.K2',
      },
      {
        id: 'mod-ops-3',
        stem: 'After an in-flight emergency deviation from Part 107, a written report is:',
        choices: [
          'Always due within 10 days',
          'Required upon request of the Administrator',
          'Never required',
          'Filed only with local police',
        ],
        correctIndex: 1,
        explanation:
          '§107.21 says send a written report if the Administrator requests it. The 10-day clock is the accident-reporting rule in §107.9, not emergency deviation.',
        reference: '14 CFR §107.21; ACS UA.IV.B.K1',
      },
    ],
  },
  {
    topicId: 'airport-operations',
    title: 'Airport operations',
    youtubeVideoId: 'Dn2JIRe4pGM',
    youtubeTitle: 'FAA Part 107 AIRPORT OPERATIONS | Remote Pilot Study Guide Pt 6 of 12',
    youtubeChannel: 'MikeSytes',
    keyPoints: [
      'Do not interfere with airport operations or traffic patterns (airports, heliports, seaplane bases).',
      'Standard airplane pattern is left-hand: upwind, crosswind, downwind, base, final—unless right traffic is indicated.',
      'Runway numbers are magnetic heading rounded to tens (Runway 09 ≈ 090°).',
      'Runway paint is white; taxiway paint is yellow. Hold-short: two solid and two dashed yellow lines.',
      'A windsock points the way the wind is going; aircraft land and take off into the wind when able.',
      'Chart Supplement plus NOTAMs give hours, CTAF, lighting, and closed surfaces that the sectional cannot show in detail.',
      'When a part-time tower closes, Class D often becomes Class E or G—read the Chart Supplement, do not guess.',
    ],
    vocabulary: [
      {
        term: 'Traffic pattern',
        definition: 'The rectangular flow of arriving and departing manned aircraft around a runway.',
      },
      {
        term: 'Segmented circle',
        definition: 'Ground indicator at many nontowered airports showing pattern direction and landing direction.',
      },
      {
        term: 'Displaced threshold',
        definition: 'A threshold moved down the runway; the pavement before it is not for landing but may be used to start a takeoff.',
      },
      {
        term: 'Hold-short marking',
        definition: 'Two solid and two dashed yellow lines; do not cross from the solid side without clearance or a plan that stays off the runway.',
      },
      {
        term: 'NOTAM',
        definition: 'Time-critical notice (closures, TFRs, navaid outages) you must check before operating near an airport.',
      },
      {
        term: 'AWOS/ASOS',
        definition: 'Automated weather on a published frequency; useful for wind and visibility before you launch nearby.',
      },
    ],
    explanation: [
      'Airport questions are spatial. If a manned aircraft announces downwind for Runway 36, it is flying a rectangle west or east of a northbound runway. Your drone on the downwind side is in that flow. Authorization to be in the Class D ring does not mean you may hover over the numbers.',
      'Markings tell you where manned traffic is protected. Chevrons are not for landing. An X means closed. White vs yellow tells runway from taxiway even when the surface looks the same color in a photo.',
      'Part-time towers change the airspace. The Chart Supplement states what the surface airspace becomes when the tower is closed. Combine that with CTAF self-announce procedures and you will not treat a quiet field as empty sky.',
    ],
    quiz: [
      {
        id: 'mod-apt-1',
        stem: 'Unless otherwise indicated, airplane traffic patterns in the U.S. are flown as:',
        choices: [
          'Right-hand turns',
          'Left-hand turns',
          'Straight-in only',
          'Opposite the windsock',
        ],
        correctIndex: 1,
        explanation:
          'Standard is left traffic. Right traffic is used when published or shown by the segmented circle. Windsocks show wind, not pattern side.',
        reference: 'AIM 4-3-3; 14 CFR §91.126; ACS UA.VI.A.K1',
      },
      {
        id: 'mod-apt-2',
        stem: 'Runway numbers are based on the runway’s:',
        choices: [
          'True heading rounded to tens of degrees',
          'Magnetic heading rounded to the nearest 10 degrees',
          'Length in hundreds of feet',
          'Airport elevation',
        ],
        correctIndex: 1,
        explanation:
          'Runway 27 faces approximately 270° magnetic. True heading, length, and elevation are different data.',
        reference: 'AIM 2-3-3; ACS UA.VI.A.K2',
      },
      {
        id: 'mod-apt-3',
        stem: 'A yellow “X” displayed on a runway means:',
        choices: [
          'Preferred landing runway',
          'The runway is closed',
          'Displaced threshold',
          'Hold short for IFR arrivals only',
        ],
        correctIndex: 1,
        explanation:
          'Closed runways and taxiways are marked with X’s (and usually NOTAMed). Displaced thresholds use arrows, not an X.',
        reference: 'AIM 2-3-6; ACS UA.VI.A.K2',
      },
    ],
  },
  {
    topicId: 'radio',
    title: 'Radio communications',
    youtubeVideoId: 'BTiwJf6eiyo',
    youtubeTitle: 'How to Read a Chart Supplement (AFD) - For Student Pilots',
    youtubeChannel: 'Part Time Pilot',
    keyPoints: [
      'CTAF is the common frequency for traffic advisories at nontowered airports (circled C on the sectional).',
      'UNICOM is a nongovernment advisory/services frequency; it is often the same number as CTAF.',
      'MULTICOM 122.9 is used when no tower, FSS, or UNICOM is available.',
      'Listen before you transmit; keep calls short: who you are, where you are, what you intend.',
      'Phonetic alphabet and digit pronunciation (niner, tree) exist so similar-sounding letters are not confused.',
      '121.5 is the emergency (guard) frequency—not a CTAF substitute.',
      'Light-gun signals are the backup if a radio fails at a towered airport; know steady/flashing green, red, and white.',
    ],
    vocabulary: [
      {
        term: 'CTAF',
        definition: 'Common Traffic Advisory Frequency—shared frequency for position and intention calls at nontowered fields.',
      },
      {
        term: 'UNICOM',
        definition: 'A nongovernment radio that may provide airport advisory, fuel, or other services.',
      },
      {
        term: 'ATIS',
        definition: 'Automatic Terminal Information Service—recorded weather and NOTAMs at many towered airports, identified by a letter.',
      },
      {
        term: 'MULTICOM 122.9',
        definition: 'The frequency commonly used for self-announce when an airport has no tower, FSS, or UNICOM.',
      },
      {
        term: 'Phonetic alphabet',
        definition: 'ICAO words (Alpha, Bravo, Charlie…) used to spell letters clearly on voice frequencies.',
      },
      {
        term: 'Light gun',
        definition: 'A tower signal light used when an aircraft has no radio or the radio has failed.',
      },
    ],
    explanation: [
      'Remote pilots are not required to talk on CTAF for every flight, but the ACS expects you to know how the system works and how to read frequencies off a sectional and the Chart Supplement. Monitoring CTAF near a nontowered airport is one of the best collision-avoidance tools you have.',
      'Do not confuse service with traffic. ATIS/AWOS tell you weather. CTAF/tower tell you where airplanes are. UNICOM might do both plus “the coffee pot is on.” The circled C is the traffic frequency.',
      'If you ever need the radio in an emergency (flyaway toward the field), speak plainly: who you are, unmanned aircraft, last known position, altitude, direction, and remaining time. Practice that sentence on the ground so you are not inventing it in a flyaway.',
    ],
    quiz: [
      {
        id: 'mod-rad-1',
        stem: 'On a sectional airport data block, CTAF is shown as:',
        choices: [
          'The frequency next to a “C” inside a circle',
          'Any frequency printed in magenta',
          'Always 121.5',
          'The star beside field elevation',
        ],
        correctIndex: 0,
        explanation:
          'The circled C marks CTAF. Magenta is often airspace/airport color, 121.5 is guard, and the lighting star is not CTAF.',
        reference: 'Aeronautical Chart User’s Guide; ACS UA.VII.A.K1',
      },
      {
        id: 'mod-rad-2',
        stem: 'The emergency frequency monitored as “guard” is:',
        choices: ['122.8', '122.9', '121.5', '123.0'],
        correctIndex: 2,
        explanation:
          '121.5 MHz is the VHF emergency frequency. 122.8 is a common CTAF/UNICOM; 122.9 is MULTICOM.',
        reference: 'AIM 6-3-1; ACS UA.VII.A.K1',
      },
      {
        id: 'mod-rad-3',
        stem: 'A flashing red light-gun signal to an aircraft in flight means:',
        choices: [
          'Cleared to land',
          'Airport unsafe — do not land',
          'Return to starting point on the airport',
          'Cleared to taxi',
        ],
        correctIndex: 1,
        explanation:
          'Flashing red in the air: do not land, airport unsafe. Steady green in the air is cleared to land. Flashing white is return to start (ground).',
        reference: 'AIM 4-3-13; ACS UA.VII.B.K1',
      },
    ],
  },
  {
    topicId: 'maintenance-preflight',
    title: 'Maintenance & preflight',
    youtubeVideoId: 'BPTt9oTeJOg',
    youtubeTitle:
      'Drone Safety Inspection Guide (DJI Matrice 4E Example): Propellers, Sensors, Gimbal & Batt',
    youtubeChannel: 'Sky Eye Imagery',
    keyPoints: [
      '§107.49 requires a preflight check of the sUAS and control station for the intended operation.',
      'If the aircraft is not in a condition for safe operation, you may not fly it (§107.15).',
      'Inspect props, arms, batteries, antennas, payload latches, firmware pairing, and the control link.',
      'Swollen, hot, or dropped lithium batteries are grounded—do not charge or fly them.',
      'Calibrate compass/IMU away from steel and vehicles when the manufacturer requires it.',
      'After a hard landing or repair, do a controlled functional check before a customer mission.',
      'Manufacturer instructions and service bulletins are part of keeping the aircraft safe, even without a manned-style annual.',
    ],
    vocabulary: [
      {
        term: 'Preflight inspection',
        definition: 'A systematic check that the aircraft, CS, loading, weather, and airspace are ready for this flight.',
      },
      {
        term: 'Condition for safe operation',
        definition: 'Legal and practical airworthiness: if you know it is unsafe, you must not operate.',
      },
      {
        term: 'Control link',
        definition: 'The command-and-control radio path between the transmitter and the aircraft.',
      },
      {
        term: 'Thermal runaway',
        definition: 'A self-heating battery failure that can lead to fire; more likely with damage, heat, or improper charging.',
      },
      {
        term: 'Firmware compatibility',
        definition: 'Aircraft, transmitter, battery, and app versions that are designed to work together.',
      },
      {
        term: 'Discrepancy',
        definition: 'Any finding that makes the system unsafe or unairworthy until corrected or deferred per the manufacturer.',
      },
    ],
    explanation: [
      'Preflight is not only “props on, GPS green.” The ACS expects you to think about weather, NOTAMs, airspace, loading, and the physical aircraft as one process. If any piece is wrong, the go/no-go is no-go.',
      'Batteries are the most common fire and flyaway contributor. Use the right charger, store at a storage charge, and retire puffed packs. A camera that looks fine does not prove the pack is safe.',
      'Document what you fix. Part 107 does not require a manned logbook format, but records help you notice a repeating vibration, a motor that runs hot, or a battery that sagged early—before it fails over people.',
    ],
    quiz: [
      {
        id: 'mod-mnt-1',
        stem: 'If a remote PIC knows the small UAS is not in a condition for safe operation, they:',
        choices: [
          'May fly a short test hop over a parking lot',
          'May not operate it',
          'May fly with a visual observer as mitigation',
          'May fly if the client accepts the risk',
        ],
        correctIndex: 1,
        explanation:
          '§107.15 is a hard stop. Test hops, VOs, and client waivers do not make an unsafe aircraft legal.',
        reference: '14 CFR §107.15; ACS UA.VIII.A.K1',
      },
      {
        id: 'mod-mnt-2',
        stem: 'A swollen lithium flight battery should be:',
        choices: [
          'Flown first to discharge it',
          'Removed from service and handled as a damaged battery per manufacturer guidance',
          'Charged overnight to reshape the cells',
          'Punctured to vent pressure',
        ],
        correctIndex: 1,
        explanation:
          'Puffing is a failure sign. Do not charge, fly, or puncture it. Isolate it and follow the manufacturer’s disposal guidance.',
        reference: 'Manufacturer instructions; ACS UA.VIII.A.K2',
      },
      {
        id: 'mod-mnt-3',
        stem: 'Part 107 requires the remote PIC to perform a preflight inspection:',
        choices: [
          'Only after an accident',
          'Prior to each flight, covering the aircraft and associated elements for the intended operation',
          'Once per calendar month',
          'Only when flying in Class B',
        ],
        correctIndex: 1,
        explanation:
          '§107.49 is before flight, every time, and it includes assessing the operating environment as well as the aircraft/CS.',
        reference: '14 CFR §107.49; ACS UA.VIII.B.K1',
      },
    ],
  },
  {
    topicId: 'human-factors-adm',
    title: 'Human factors & ADM',
    youtubeVideoId: 't2sQeeh8A5Y',
    youtubeTitle: 'The 5 Hazardous Pilot Attitudes Explained | FAA Part 107 Prep',
    youtubeChannel: 'Meridian Media',
    keyPoints: [
      'Hazardous attitudes: anti-authority, impulsivity, invulnerability, macho, resignation—each has an antidote.',
      'IMSAFE checks the PIC: Illness, Medication, Stress, Alcohol, Fatigue, Emotion/Eating.',
      'PAVE splits risk: Pilot, Aircraft, enVironment, External pressures.',
      '3P: Perceive, Process, Perform. CARE and TEAM are tools inside Process/Perform.',
      'DECIDE is a slower loop: Detect, Estimate, Choose, Identify, Do, Evaluate.',
      'Night vision takes up to about 30 minutes to adapt; protect it from bright screens.',
      'CRM/SRM: use the VO, checklists, apps, and personal minimums—do not let a client make the go/no-go call.',
    ],
    vocabulary: [
      {
        term: 'ADM',
        definition: 'Aeronautical decision making—a systematic approach to detecting and managing risk.',
      },
      {
        term: 'Hazardous attitude',
        definition: 'A recognized mindset (for example macho or impulsivity) that leads to poor decisions unless antidoted.',
      },
      {
        term: 'IMSAFE',
        definition: 'Personal fitness checklist: Illness, Medication, Stress, Alcohol, Fatigue, Emotion/Eating.',
      },
      {
        term: 'PAVE',
        definition: 'Risk categories: Pilot, Aircraft, enVironment, External pressures.',
      },
      {
        term: 'Empty-field myopia',
        definition: 'The eyes focusing at a short distance when looking into a featureless sky, so traffic is missed.',
      },
      {
        term: 'Autokinesis',
        definition: 'A night illusion where a stationary light appears to move if you stare at it.',
      },
    ],
    explanation: [
      'The FAA does not just want you to name the five attitudes—it wants the antidote. Anti-authority: follow the rules, they are usually right. Impulsivity: not so fast, think first. Invulnerability: it could happen to me. Macho: taking chances is foolish. Resignation: I can make a difference.',
      'Most “I have to get the shot” accidents are PAVE external pressure plus fatigue. Build personal minimums (wind, DA, battery reserve, crew) before the client is on site so the no-go is already decided.',
      'Physiology still counts on the ground. Medication, a hangover, and a bright tablet at night all degrade scanning. Empty-field myopia is why you move your eyes in sectors instead of staring at one patch of blue.',
    ],
    quiz: [
      {
        id: 'mod-hf-1',
        stem: 'The antidote to impulsivity is best stated as:',
        choices: [
          'It won’t happen to me',
          'Not so fast — think first',
          'I can do it',
          'What’s the use',
        ],
        correctIndex: 1,
        explanation:
          'Impulsivity’s antidote is “Not so fast. Think first.” “It won’t happen to me” is invulnerability; “I can do it” is macho; “What’s the use” is resignation.',
        reference: 'PHAK Chapter 2; ACS UA.IX.A.K1',
      },
      {
        id: 'mod-hf-2',
        stem: 'The IMSAFE checklist is used to evaluate:',
        choices: [
          'Airport lighting systems',
          'The remote PIC’s personal fitness to fly',
          'UAS Facility Map altitudes',
          'METAR decoding only',
        ],
        correctIndex: 1,
        explanation:
          'IMSAFE is a self-assessment of the person flying. Lighting, UASFMs, and METARs are other tools.',
        reference: 'PHAK Chapter 2; ACS UA.IX.B.K1',
      },
      {
        id: 'mod-hf-3',
        stem: 'PAVE organizes risk into:',
        choices: [
          'Pilot, Aircraft, enVironment, External pressures',
          'Power, Attitude, Velocity, Elevation',
          'People, Airspace, Vehicles, Emergencies',
          'Plan, Act, Verify, Exit',
        ],
        correctIndex: 0,
        explanation:
          'PAVE is Pilot, Aircraft, enVironment, External pressures. The other expansions are invented.',
        reference: 'PHAK Chapter 2; ACS UA.IX.A.K3',
      },
    ],
  },
]

function isStudyModule(value: unknown): value is StudyModule {
  if (typeof value !== 'object' || value === null) return false
  const mod = value as StudyModule
  return (
    TOPIC_IDS.includes(mod.topicId) &&
    typeof mod.youtubeVideoId === 'string' &&
    mod.youtubeVideoId.length > 0 &&
    Array.isArray(mod.keyPoints) &&
    mod.keyPoints.length >= 5 &&
    mod.keyPoints.length <= 8 &&
    Array.isArray(mod.vocabulary) &&
    mod.vocabulary.length >= 6 &&
    mod.vocabulary.length <= 10 &&
    Array.isArray(mod.explanation) &&
    mod.explanation.length >= 1 &&
    mod.explanation.length <= 3 &&
    Array.isArray(mod.quiz) &&
    mod.quiz.length === 3
  )
}

function loadModules(): StudyModule[] {
  if (STUDY_MODULES.length !== TOPIC_IDS.length) {
    throw new Error(`Expected ${TOPIC_IDS.length} study modules`)
  }
  const seen = new Set<TopicId>()
  for (const [index, mod] of STUDY_MODULES.entries()) {
    if (!isStudyModule(mod)) {
      throw new Error(`Invalid study module at index ${index}`)
    }
    if (seen.has(mod.topicId)) {
      throw new Error(`Duplicate module topic ${mod.topicId}`)
    }
    seen.add(mod.topicId)
    const quizIds = new Set<string>()
    for (const item of mod.quiz) {
      if (quizIds.has(item.id)) throw new Error(`Duplicate module quiz id ${item.id}`)
      quizIds.add(item.id)
      if (
        item.choices.length !== 4 ||
        item.reference.trim().length === 0 ||
        item.explanation.trim().length === 0
      ) {
        throw new Error(`Invalid quiz item ${item.id}`)
      }
    }
  }
  for (const topicId of TOPIC_IDS) {
    if (!seen.has(topicId)) throw new Error(`Missing module for ${topicId}`)
  }
  return STUDY_MODULES
}

export const MODULES: StudyModule[] = loadModules()

export function getModule(topicId: TopicId): StudyModule {
  const match = MODULES.find((mod) => mod.topicId === topicId)
  if (!match) throw new Error(`Unknown module topic ${topicId}`)
  return match
}
