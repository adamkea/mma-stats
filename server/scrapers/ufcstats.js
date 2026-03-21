const cheerio = require("cheerio");
const cache = require("../cache/store");

const BASE_URL = "http://www.ufcstats.com/statistics/fighters/search";
const FIGHTER_URL = "http://www.ufcstats.com/fighter-details";
const EVENTS_URL = "http://www.ufcstats.com/statistics/events";
const EVENT_URL = "http://www.ufcstats.com/event-details";

async function searchFighters(name) {
  const cacheKey = `search:${name.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const query = name.split(" ").join("+");
  const url = `${BASE_URL}?query=${query}&page=all`;

  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const fighters = [];
  $("tbody tr").each((_i, row) => {
    const cols = $(row).find("td");
    const nameLink = $(cols[0]).find("a");
    const href = nameLink.attr("href");
    const fighterName = `${$(cols[0]).text().trim()} ${$(cols[1]).text().trim()}`.trim();

    if (href && fighterName) {
      const id = href.split("/").pop();
      fighters.push({
        id,
        name: fighterName,
        nickname: $(cols[2]).text().trim() || null,
        record: {
          wins: parseInt($(cols[3]).text().trim()) || 0,
          losses: parseInt($(cols[4]).text().trim()) || 0,
          draws: parseInt($(cols[5]).text().trim()) || 0,
        },
        weight: $(cols[6]).text().trim() || null,
      });
    }
  });

  cache.set(cacheKey, fighters);
  return fighters;
}

async function getFighterDetails(fighterId) {
  const cacheKey = `fighter:${fighterId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const url = `${FIGHTER_URL}/${fighterId}`;
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const name = $("span.b-content__title-highlight").text().trim();
  const nickname = $("p.b-content__Nickname").text().trim() || null;

  // Parse record from the header
  const recordText = $("span.b-content__title-record").text().trim();
  const recordMatch = recordText.match(/Record:\s*(\d+)-(\d+)-(\d+)/);
  const record = recordMatch
    ? { wins: +recordMatch[1], losses: +recordMatch[2], draws: +recordMatch[3] }
    : { wins: 0, losses: 0, draws: 0 };

  // Parse physical stats
  const stats = {};
  $("ul.b-list__box-list li").each((_i, el) => {
    const text = $(el).text().trim();
    const [label, value] = text.split(":").map((s) => s.trim());
    if (label && value && value !== "--") {
      stats[label.toLowerCase().replace(/\s+/g, "_")] = value;
    }
  });

  // Parse fight history
  const fights = [];
  $("tbody.b-fight-details__table-body tr").each((_i, row) => {
    const cols = $(row).find("td");
    if (cols.length < 10) return;

    const result = $(cols[0]).find("a, .b-flag").text().trim();
    const opponent = $(cols[1]).find("a").last().text().trim();
    const event = $(cols[2]).find("a").text().trim();
    const eventLink = $(cols[2]).find("a").attr("href");
    const method = $(cols[7]).text().trim().replace(/\s+/g, " ");
    const round = $(cols[8]).text().trim();
    const time = $(cols[9]).text().trim();

    fights.push({
      result: result.substring(0, 1).toUpperCase() || null,
      opponent,
      event,
      eventLink: eventLink || null,
      method,
      round: parseInt(round) || null,
      time: time || null,
    });
  });

  const fighter = {
    id: fighterId,
    name,
    nickname,
    record,
    stats,
    fights,
  };

  cache.set(cacheKey, fighter);
  return fighter;
}

async function getEvents() {
  const cacheKey = "events:list";
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const [upcomingRes, completedRes] = await Promise.all([
    fetch(`${EVENTS_URL}/upcoming`),
    fetch(`${EVENTS_URL}/completed`),
  ]);
  const [upcomingHtml, completedHtml] = await Promise.all([
    upcomingRes.text(),
    completedRes.text(),
  ]);

  function parseEventRows($, limit) {
    const events = [];
    $("tbody tr").each((_i, row) => {
      if (limit && events.length >= limit) return false;
      const nameLink = $(row).find("td:first-child a");
      const href = nameLink.attr("href");
      const name = nameLink.text().trim();
      const date = $(row).find("td:first-child span").text().trim() ||
                   $(row).find("td:nth-child(2)").text().trim();
      const location = $(row).find("td:last-child").text().trim();

      if (href && name) {
        const id = href.split("/").pop();
        events.push({ id, name, date: date || null, location: location || null });
      }
    });
    return events;
  }

  const $upcoming = cheerio.load(upcomingHtml);
  const $completed = cheerio.load(completedHtml);

  const result = {
    upcoming: parseEventRows($upcoming, 10),
    completed: parseEventRows($completed, 3),
  };

  cache.set(cacheKey, result, 30 * 60 * 1000); // 30 min TTL
  return result;
}

async function getEventDetails(eventId) {
  const cacheKey = `event:${eventId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const url = `${EVENT_URL}/${eventId}`;
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const name = $("h2.b-content__title-highlight, span.b-content__title-highlight").text().trim();
  const date = $("li.b-list__box-list-item:first-child").text().replace("Date:", "").trim();
  const location = $("li.b-list__box-list-item:nth-child(2)").text().replace("Location:", "").trim();

  const fights = [];
  $("tbody tr.b-fight-details__table-row").each((_i, row) => {
    const cols = $(row).find("td");
    if (cols.length < 2) return;

    const fighterLinks = $(cols[0]).find("p a");
    if (fighterLinks.length < 2) return;

    const fighter1Link = $(fighterLinks[0]);
    const fighter2Link = $(fighterLinks[1]);
    const weightClass = $(cols[6]).find("p").first().text().trim();

    fights.push({
      fighter1: {
        id: (fighter1Link.attr("href") || "").split("/").pop(),
        name: fighter1Link.text().trim(),
      },
      fighter2: {
        id: (fighter2Link.attr("href") || "").split("/").pop(),
        name: fighter2Link.text().trim(),
      },
      weightClass: weightClass || null,
    });
  });

  const event = { id: eventId, name, date: date || null, location: location || null, fights };
  cache.set(cacheKey, event);
  return event;
}

module.exports = { searchFighters, getFighterDetails, getEvents, getEventDetails };
