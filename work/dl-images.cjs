// 下载 atlas/location 页所需图片素材（官方 API，直连可用）
const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE = 'https://www.theatlas.hk/api/media/file/';
const OUT = path.join(__dirname, '..', 'assets', 'img');

const files = [
  // 设施图（the-atlas 会所）
  ['facilities/lounge.webp', '01_loungeA_R02_20260813.webp'],
  ['facilities/pool.webp', '45_pool_day_R02_20260818_with_box.webp'],
  ['facilities/whale-park.webp', '36_KIDS_R02_20260818.webp'],
  ['facilities/submarine.webp', '09_indoor_children_play_R03_20260820.webp'],
  ['facilities/farm.webp', '46_farm_R02_20260818-1.webp'],
  ['facilities/glamping.webp', '44_glamping_R02_20260818.webp'],
  ['facilities/seashore.webp', '25_KTV_R02_20260813-1.webp'],
  ['facilities/lagoon.webp', '24_entertainment_R02_20260813-1.webp'],
  ['facilities/gym.webp', '16_GYM_R02_20260813.webp'],
  ['facilities/surf-arena.webp', '18_interactive_R02_20260813.webp'],
  ['facilities/run-arena.webp', '17_interactive_R02_20260813.webp'],
  ['facilities/yoga.webp', '06_Yoga_R02_20260812.webp'],
  ['facilities/furryland.webp', '43_pet_R02_20260818.webp'],
  ['facilities/pet-grooming.webp', '14_pet_grooming_R02_20260813.webp'],
  ['facilities/band-room.webp', '61_band_room_R02_20260820.webp'],
  ['facilities/coworking.webp', '02_coworking_R02_20260813.webp'],
  ['facilities/marina.webp', '22_director_villa_R02_20260820.webp'],
  ['facilities/serene-garden.webp', '42_greenery_R02_20260817.webp'],
  // 建筑入口图
  ['facilities/entrance.webp', '32_entrance_R02_20260818_C.webp'],
  // 品牌 Logo
  ['brands/miele.webp', 'Miele_Logo.webp'],
  ['brands/gaggenau.webp', 'Gaggenau_Logo.webp'],
  ['brands/kohler.webp', 'Kohler_Logo.webp'],
  ['brands/daikin.webp', 'Daikin_Logo.webp'],
  ['brands/panasonic.webp', 'Panasonic_Logo.webp'],
  // location 航拍图
  ['drone.webp', 'Drone%20Shot_2060902.webp']
];

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) { res.resume(); return reject(new Error('HTTP ' + res.statusCode)); }
      const ch = [];
      res.on('data', c => ch.push(c));
      res.on('end', () => resolve(Buffer.concat(ch)));
    }).on('error', reject);
  });
}

(async () => {
  let ok = 0, fail = 0;
  for (const [rel, remote] of files) {
    const dest = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    try {
      const buf = await get(BASE + remote);
      // 校验非 HTML 兜底页
      if (buf.length < 500 || buf.slice(0, 15).toString('utf8').indexOf('<!doctype') === 0) {
        console.log('BAD', rel, buf.length); fail++; continue;
      }
      fs.writeFileSync(dest, buf);
      console.log('OK ', rel, buf.length);
      ok++;
    } catch (e) {
      console.log('FAIL', rel, e.message);
      fail++;
    }
  }
  console.log('done ok=' + ok + ' fail=' + fail);
})();