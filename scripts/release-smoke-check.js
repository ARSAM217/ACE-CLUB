'use strict';
// Static release guardrails; this is not a substitute for HTTP/integration tests.
const fs = require('fs');
const assert = require('assert');
const server = fs.readFileSync('server.js', 'utf8');
const app = fs.readFileSync('public/app.js', 'utf8');
const css = fs.readFileSync('public/style.css', 'utf8');
const checks = [
  ['group join requests API', /app\.post\('\/api\/groups\/:id\/join'/.test(server) && /app\.post\('\/api\/groups\/:id\/join-requests\/:requestId\/respond'/.test(server)],
  ['group join authorization', /فقط مدیران گروه می‌توانند درخواست را بررسی کنند/.test(server)],
  ['group mute persistence', /INSERT INTO group_user_settings\(group_id,user_id,muted/.test(server)],
  ['group mode edit persistence', /UPDATE chat_groups SET name=\?,description=\?,avatar=\?,access_mode=\? WHERE id=\?/.test(server)],
  ['admin game history pagination', /LIMIT \$\{limit\} OFFSET \$\{offset\}/.test(server) && /COUNT\(\*\) n FROM game_rooms r/.test(server)],
  ['game history includes departed players', /FROM game_results WHERE room_id=\?/.test(server) && /UNION SELECT user_id,created_at AS joined_at,room_id FROM game_results/.test(server)],
  ['cosmetic coin purchase path', /const currency=item\.kind==='frame'\?'coins':'diamonds'/.test(server)],
  ['daily fame reward uses coins at 21 Iran time', /activity-coins:'\+today/.test(server) && /daily_activity_coin_distributions/.test(server) && /daily_activity_coins/.test(server)],
  ['APK upload endpoint', /app\.post\('\/api\/admin\/app-release'/.test(server)],
  ['APK download endpoint', /app\.get\('\/api\/app-release\/:id\/download'/.test(server)],
  ['install page link', /data-store-tab="cosmetics"/.test(app) && /نصب اپلیکیشن/.test(app)],
  ['all catalog frame palettes styled', ['violet','sunset','royal','chrome','opal'].every(x=>css.includes('avatar-frame-'+x))],
];
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  assert.ok(ok, `Static check failed: ${name}`);
}
console.log(`\n${checks.length}/${checks.length} static checks passed. No live database or HTTP integration is exercised by this script.`);
