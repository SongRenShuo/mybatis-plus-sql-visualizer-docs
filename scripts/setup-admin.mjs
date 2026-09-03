const ITERATIONS = 100000;
const SALT_LENGTH = 16;

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial, 256
  );
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  return ['pbkdf2', ITERATIONS, saltHex, hashHex].join('$');
}

const args = process.argv.slice(2);
const username = args[0];
const password = <REDACTED>

if (!username || !password) {
  console.error('Usage: node scripts/setup-admin.mjs <username> <password>');
  process.exit(1);
}

const hash = await hashPassword(password);
console.log('-- Admin: ' + username);
console.log("INSERT OR IGNORE INTO sys_admins (username, password, display_name, role) VALUES ('" + username + "', '" + hash + "', 'Admin', 2);");
