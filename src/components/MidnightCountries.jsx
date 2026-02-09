import { useMemo, useState, useEffect } from 'react';

/**
 * Parse a UTC offset string like "UTC+05:30" or "UTC-03:00" into minutes offset.
 * Also handles "UTC" (= 0).
 */
const parseUtcOffset = (tz) => {
  if (!tz || tz === 'UTC') return 0;
  const match = tz.match(/^UTC([+-])(\d{1,2}):?(\d{2})?$/);
  if (!match) return null;
  const sign = match[1] === '+' ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3] || '0', 10);
  return sign * (hours * 60 + minutes);
};

/**
 * Check if a given UTC offset (in minutes) is currently near midnight.
 * "Near midnight" = local time between 23:30 and 00:30.
 */
const isNearMidnight = (offsetMinutes, now) => {
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  let localMinutes = (utcMinutes + offsetMinutes) % 1440;
  if (localMinutes < 0) localMinutes += 1440;
  // 23:30 = 1410, 00:30 = 30
  return localMinutes >= 1410 || localMinutes <= 30;
};

/**
 * Get local time string for a given UTC offset.
 */
const getLocalTime = (offsetMinutes, now) => {
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const localMs = utcMs + offsetMinutes * 60000;
  const localDate = new Date(localMs);
  return localDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const MidnightCountries = ({ countries }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000); // update every 30s
    return () => clearInterval(timer);
  }, []);

  const midnightList = useMemo(() => {
    const result = [];
    const seen = new Set();

    for (const country of countries) {
      if (!country.timezones || seen.has(country.name.official)) continue;

      for (const tz of country.timezones) {
        const offset = parseUtcOffset(tz);
        if (offset === null) continue;

        if (isNearMidnight(offset, now)) {
          seen.add(country.name.official);
          result.push({
            name: country.name.common,
            flag: country.flags?.png,
            emoji: country.flag,
            timezone: tz,
            localTime: getLocalTime(offset, now),
          });
          break; // only add country once
        }
      }
    }

    return result.slice(0, 8); // cap at 8
  }, [countries, now]);

  if (midnightList.length === 0) return null;

  return (
    <div className="midnight-countries">
      <div className="midnight-header">
        <span className="midnight-icon" aria-hidden="true">🌙</span>
        <span className="midnight-title">It's Midnight In...</span>
      </div>
      <div className="midnight-list">
        {midnightList.map((c) => (
          <div key={c.name} className="midnight-chip">
            {c.emoji && <span className="midnight-flag">{c.emoji}</span>}
            <span className="midnight-name">{c.name}</span>
            <span className="midnight-time mono">{c.localTime}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MidnightCountries;
