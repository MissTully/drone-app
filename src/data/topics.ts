import { TOPIC_IDS, type TopicId } from '../types'

export { TOPIC_IDS }

export type TopicInfo = {
  id: TopicId
  label: string
  blurb: string
}

export const TOPICS: TopicInfo[] = [
  {
    id: 'regulations',
    label: 'Regulations',
    blurb: 'Part 107 rules, certificates, and operating limits',
  },
  {
    id: 'airspace',
    label: 'Airspace & flight restrictions',
    blurb: 'Classes, authorizations, TFRs, and special use airspace',
  },
  {
    id: 'weather',
    label: 'Weather',
    blurb: 'METAR/TAF, visibility, clouds, and density altitude',
  },
  {
    id: 'loading-performance',
    label: 'Loading & performance',
    blurb: 'Weight, CG, density altitude, and aircraft limits',
  },
  {
    id: 'operations-emergency',
    label: 'Operations & emergency procedures',
    blurb: 'VLOS, lost link, night ops, and right-of-way',
  },
  {
    id: 'airport-operations',
    label: 'Airport operations',
    blurb: 'Patterns, CTAF, markings, and airport environment',
  },
  {
    id: 'radio',
    label: 'Radio communications',
    blurb: 'Phraseology, CTAF, UNICOM, and phonetic alphabet',
  },
  {
    id: 'maintenance-preflight',
    label: 'Maintenance & preflight',
    blurb: 'Inspections, batteries, and condition for safe flight',
  },
  {
    id: 'human-factors-adm',
    label: 'Human factors & ADM',
    blurb: 'Hazardous attitudes, IMSAFE, and decision making',
  },
]

export const TOPIC_LABELS: Record<TopicId, string> = {
  regulations: 'Regulations',
  airspace: 'Airspace & flight restrictions',
  weather: 'Weather',
  'loading-performance': 'Loading & performance',
  'operations-emergency': 'Operations & emergency procedures',
  'airport-operations': 'Airport operations',
  radio: 'Radio communications',
  'maintenance-preflight': 'Maintenance & preflight',
  'human-factors-adm': 'Human factors & ADM',
}

export const DISCLAIMER =
  'This is a study aid. Questions are not official FAA test items.'

export const PRACTICE_SESSION_SIZE = 25
export const TEST_QUESTION_COUNT = 60
export const TEST_DURATION_MS = 2 * 60 * 60 * 1000
export const PASS_THRESHOLD = 0.7
export const PROGRESS_STORAGE_KEY = 'drone-app-progress'
export const SESSION_STORAGE_KEY = 'drone-app-session'
export const RESULT_STORAGE_KEY = 'drone-app-last-result'
