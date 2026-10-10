import {
  RegionId,
  LeadDay,
  RegionalMetric,
  AudienceType,
  SectorAdvisory,
  RunHistoryItem,
  RollingAccuracyRecord,
  QueryParseResult,
} from '../types/forecast';
import { FORECAST_DATABASE, ACCURACY_HISTORY_DATA, REGIONS } from '../data/mockForecastData';

// Simulated low-latency asynchronous call for operational UI feel
const simulateLatency = <T>(data: T, delay = 300): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

export async function getConfidence(region: RegionId, day: LeadDay): Promise<RegionalMetric> {
  const key = `${region}_${day}`;
  const record = FORECAST_DATABASE[key] || FORECAST_DATABASE['Delhi_1'];
  return simulateLatency({ ...record });
}

export async function getMultiDayOutlook(region: RegionId): Promise<RegionalMetric[]> {
  const results: RegionalMetric[] = [];
  for (let d = 1; d <= 10; d++) {
    const key = `${region}_${d}`;
    results.push(FORECAST_DATABASE[key]);
  }
  return simulateLatency(results, 250);
}

export async function getAllRegionsForDay(day: LeadDay): Promise<RegionalMetric[]> {
  const results = REGIONS.map((r) => FORECAST_DATABASE[`${r.id}_${day}`]);
  return simulateLatency(results, 280);
}

export async function getAccuracyHistory(): Promise<RollingAccuracyRecord[]> {
  return simulateLatency([...ACCURACY_HISTORY_DATA], 300);
}

export async function getForecastRuns(region: RegionId, day: LeadDay): Promise<RunHistoryItem[]> {
  const base = FORECAST_DATABASE[`${region}_${day}`];
  const bProb = base.bustProbability;

  const runMinus24 = Math.max(10, Math.min(90, Math.round(bProb - (day > 5 ? 18 : 6))));
  const runMinus12 = Math.max(10, Math.min(92, Math.round(bProb - (day > 5 ? 8 : -3))));
  const currentRun = bProb;

  const runs: RunHistoryItem[] = [
    {
      runLabel: 'Operational Run T-24h (00 UTC Prev)',
      runOffsetHours: -24,
      bustProbability: runMinus24,
      confidenceScore: 100 - runMinus24,
      varianceFlag: Math.abs(currentRun - runMinus24) > 15,
    },
    {
      runLabel: 'Operational Run T-12h (12 UTC Prev)',
      runOffsetHours: -12,
      bustProbability: runMinus12,
      confidenceScore: 100 - runMinus12,
      varianceFlag: Math.abs(currentRun - runMinus12) > 10,
    },
    {
      runLabel: 'Current Operational Run (00 UTC Target)',
      runOffsetHours: 0,
      bustProbability: currentRun,
      confidenceScore: 100 - currentRun,
      varianceFlag: false,
    },
  ];

  return simulateLatency(runs, 240);
}

export async function getSectorView(
  region: RegionId,
  day: LeadDay,
  audience: AudienceType
): Promise<SectorAdvisory> {
  const base = FORECAST_DATABASE[`${region}_${day}`];
  const isHighBust = base.bustProbability >= 55;
  const isModerateBust = base.bustProbability >= 35 && base.bustProbability < 55;

  let text = '';
  let guidance = '';
  let riskTier: SectorAdvisory['riskTier'] = 'Normal';

  if (audience === 'General') {
    if (isHighBust) {
      riskTier = 'Critical';
      text = `The ${region} Day ${day} weather forecast displays elevated uncertainty. Numerical atmospheric models are currently in divergence regarding precipitation timing and wind patterns.`;
      guidance = 'Check local meteorological updates closer to date before confirming outdoor travels or major logistical arrangements.';
    } else if (isModerateBust) {
      riskTier = 'Advisory';
      text = `The ${region} Day ${day} forecast shows moderate confidence. Baseline weather trends are likely, but local precipitation intensity may vary.`;
      guidance = 'Routine weather vigilance is advised; no disruption to standard schedules recommended at this lead time.';
    } else {
      riskTier = 'Normal';
      text = `High confidence observed for ${region} on Day ${day}. Synoptic patterns remain stable and consistent across numerical ensembles.`;
      guidance = 'Forecast can be utilized for general planning with standard reliability expectations.';
    }
  } else if (audience === 'Farmer') {
    if (isHighBust) {
      riskTier = 'Critical';
      text = `Severe model disagreement detected for ${region} on Day ${day}. Precipitation amount and soil moisture retention projections carry high bust risk.`;
      guidance = 'Postpone chemical spraying, fertilizer top-dressing, and harvest drying activities until run-to-run forecast stability stabilizes in subsequent cycles.';
    } else if (isModerateBust) {
      riskTier = 'Watch';
      text = `Moderate uncertainty on Day ${day} for ${region}. Trough alignment suggests possible localized rain episodes differing from bulk NWP output.`;
      guidance = 'Prepare field drainage channels and monitor soil saturation without suspending immediate irrigation tasks.';
    } else {
      riskTier = 'Normal';
      text = `Stable meteorological envelope for ${region} at Day ${day}. Precipitation thresholds are backed by low ensemble spread.`;
      guidance = 'Favorable reliability for standard sowing, scheduled irrigation, and seasonal harvesting routines.';
    }
  } else {
    // Disaster Management
    if (isHighBust) {
      riskTier = 'Critical';
      text = `ELEVATED FORECAST BUST RISK DETECTED FOR ${region.toUpperCase()} AT LEAD DAY ${day} (Bust Probability: ${base.bustProbability}%). Ensemble members show wide spatial spread in cyclonic vorticity and moisture surge.`;
      guidance = 'Alert state disaster response units for contingency readiness. Initiate high-frequency multi-model radar/satellite tracking as lead day shortens. Do not rely exclusively on single deterministic NWP runs.';
    } else if (isModerateBust) {
      riskTier = 'Watch';
      text = `Standard alert buffer: Moderate divergence observed in Day ${day} forecast for ${region}. Steering currents indicate potential track or timing variance of weather systems.`;
      guidance = 'Verify regional resource availability and maintain standard inter-departmental communication channels.';
    } else {
      riskTier = 'Normal';
      text = `No synoptic instability flags triggered for ${region} Day ${day}. NWP ensemble clusters show high convergence with low historical error indices.`;
      guidance = 'Standard operational monitoring; no specialized escalation protocol required at present lead time.';
    }
  }

  return simulateLatency({
    audience,
    region,
    leadDay: day,
    advisoryText: text,
    actionGuidance: guidance,
    riskTier,
  });
}

export async function askForecast(rawQuery: string): Promise<QueryParseResult> {
  const query = rawQuery.toLowerCase();

  let detectedRegion: RegionId = 'Chennai';
  for (const r of REGIONS) {
    if (query.includes(r.id.toLowerCase())) {
      detectedRegion = r.id;
      break;
    }
  }

  let detectedDay: LeadDay = 4;
  const dayMatch = query.match(/day\s*([1-9]|10)/i) || query.match(/([1-9]|10)\s*day/i);
  if (dayMatch && dayMatch[1]) {
    const val = parseInt(dayMatch[1], 10);
    if (val >= 1 && val <= 10) detectedDay = val as LeadDay;
  } else if (query.includes('tomorrow')) {
    detectedDay = 2;
  } else if (query.includes('today')) {
    detectedDay = 1;
  } else if (query.includes('week') || query.includes('7 days')) {
    detectedDay = 7;
  }

  let variable = 'Precipitation & Synoptic Systems';
  if (query.includes('rain') || query.includes('rainfall') || query.includes('monsoon')) {
    variable = 'Precipitation & Convective Activity';
  } else if (query.includes('heat') || query.includes('temp') || query.includes('heatwave')) {
    variable = 'Surface Temperature & Thermal Advection';
  } else if (query.includes('cyclone') || query.includes('wind') || query.includes('storm')) {
    variable = 'Cyclonic Circulation & Wind Vorticity';
  }

  const record = FORECAST_DATABASE[`${detectedRegion}_${detectedDay}`];

  const answer = `${detectedRegion}'s Day ${detectedDay} forecast demonstrates ${record.confidenceClass.replace('_', ' ')} confidence with a calculated bust probability of ${record.bustProbability}%. The primary uncertainty driver is ${record.topReasons[0].feature.toLowerCase()} (${record.topReasons[0].impact}).`;

  return simulateLatency(
    {
      identifiedRegion: detectedRegion,
      identifiedLeadDay: detectedDay,
      identifiedVariable: variable,
      summaryAnswer: answer,
      metric: record,
    },
    380
  );
}
