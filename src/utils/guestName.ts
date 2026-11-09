import { PlayerId } from '../types/game';

/**
 * Generates a random Guest username in the format: Guest + 7 random digits.
 * Example: Guest1234565, Guest8274910, Guest5628391
 *
 * @param existingNames Optional set of already used names to avoid collisions.
 */
export function generateGuestName(existingNames?: Set<string> | string[]): string {
  const existingSet = Array.isArray(existingNames)
    ? new Set(existingNames)
    : existingNames || new Set<string>();

  let name = '';
  let attempts = 0;

  do {
    // Exactly 7 random digits (1000000 to 9999999)
    const randomDigits = Math.floor(1000000 + Math.random() * 9000000);
    name = `Guest${randomDigits}`;
    attempts++;
  } while (existingSet.has(name) && attempts < 100);

  return name;
}

/**
 * Generates four distinct Guest names for the 4 player seats:
 * SOUTH (Human), NORTH (AI Partner), WEST (AI Opponent 1), EAST (AI Opponent 2)
 */
export function generateFourGuestNames(): Record<PlayerId, string> {
  const used = new Set<string>();

  const south = generateGuestName(used);
  used.add(south);

  const north = generateGuestName(used);
  used.add(north);

  const west = generateGuestName(used);
  used.add(west);

  const east = generateGuestName(used);
  used.add(east);

  return {
    SOUTH: south,
    NORTH: north,
    WEST: west,
    EAST: east,
  };
}

/**
 * Retrieves or initializes the guest username for the current browser session.
 */
export function getOrCreateSessionGuestName(forceNew: boolean = false): string {
  if (typeof window === 'undefined') return generateGuestName();

  const KEY = '28_card_master_session_guest_name';
  if (!forceNew) {
    const existing = sessionStorage.getItem(KEY);
    if (existing && /^Guest\d{7}$/.test(existing)) {
      return existing;
    }
  }

  const newName = generateGuestName();
  try {
    sessionStorage.setItem(KEY, newName);
  } catch {
    // sessionStorage fallback
  }
  return newName;
}
