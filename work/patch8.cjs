// 用官方 the-atlas / location 页内容重写 i18n.js 的 atlas 与 location 区块（三语）
const fs = require('fs');
const p = 'assets/js/i18n.js';
let s = fs.readFileSync(p, 'utf8');

/* ---------- 序列化工具 ---------- */
function ser(v, ind) {
  const pad = '      ';
  if (typeof v === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    if (v.every(x => typeof x === 'string')) return '[\n' + v.map(x => pad + '  ' + JSON.stringify(x)).join(',\n') + '\n' + pad + ']';
    return '[\n' + v.map(x => pad + '  ' + ser(x, ind + 1)).join(',\n') + '\n' + pad + ']';
  }
  const ks = Object.keys(v);
  return '{\n' + ks.map(k => pad + k + ': ' + ser(v[k], ind + 1)).join(',\n') + '\n' + pad.slice(2) + '}';
}
const S = n => String(n).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]).join('');

/* ---------- 保留原有 facts（代理资料） ---------- */
const factsHK = [
  ["發展項目", "擎海 THE ATLAS（第 1 期）"],
  ["區域", "茶果嶺、油塘、鯉魚門"],
  ["街道及門牌", "東源街 23 號（第 1 期，臨時門牌）"],
  ["座數", "第 3 座、第 5 座"],
  ["住宅單位總數", "617 伙"],
  ["戶型分布", "1 房（開廚）348 伙；2 房 107 伙；2 房（開廚）107 伙；2 房（開廚）+ 儲物室 1 伙；3 房 1 套 + 工作間 27 伙；3 房 1 套 + 工作套 27 伙"],
  ["實用面積", "約 242 – 721 平方呎"],
  ["預計關鍵日期", "2028 年 12 月 30 日"],
  ["期數", "全個發展項目共 3 期"]
];
const factsCN = factsHK.map(r => [r[0].replace(/發展項目|區域|街道及門牌|座數|住宅單位總數|戶型分布|實用面積|預計關鍵日期|期數/g, m => ({ '發展項目': '发展项目', '區域': '区域', '街道及門牌': '街道及门牌', '座數': '座数', '住宅單位總數': '住宅单位总数', '戶型分布': '户型分布', '實用面積': '实用面积', '預計關鍵日期': '预计关键日期', '期數': '期数' }[m])), r[1].replace(/擎海 THE ATLAS（第 1 期）/, '擎海 THE ATLAS（第 1 期）').replace(/茶果嶺、油塘、鯉魚門/, '茶果岭、油塘、鲤鱼门').replace(/東源街 23 號（第 1 期，臨時門牌）/, '东源街 23 号（第 1 期，临时门牌）').replace(/第 3 座、第 5 座/, '第 3 座、第 5 座').replace(/伙/g, '伙').replace(/開廚/g, '开厨').replace(/儲物室/g, '储物室').replace(/工作間/g, '工作间').replace(/工作套/g, '工作套').replace(/實用面積/, '实用面积').replace(/約 242 – 721 平方呎/, '约 242 – 721 平方呎').replace(/全個發展項目共 3 期/, '整个发展项目共 3 期')]);
const factsEN = [
  ["Development", "THE ATLAS (Phase 1)"],
  ["District", "Cha Kwo Ling, Yau Tong, Lei Yue Mun"],
  ["Street No.", "23 Tung Yuen Street (Phase 1, provisional)"],
  ["Towers", "Tower 3 & Tower 5"],
  ["Total Units", "617"],
  ["Flat Mix", "1-BR (open kitchen) ×348; 2-BR ×107; 2-BR (open kitchen) ×107; 2-BR (open kitchen) + store ×1; 3-BR suite + utility ×27; 3-BR suite + utility & WC ×27"],
  ["Saleable Area", "approx. 242 – 721 sq. ft."],
  ["Estimated Material Date", "30 December 2028"],
  ["Phases", "3 phases in total"]
];

/* ---------- 三语内容 ---------- */
const FAC = {
  hk: [["lounge","COZY LOUNGE 逸意雅座"],["pool","AZURE POOL 天藍泳池"],["whale-park","WHALE PARK 鯨樂天地"],["submarine","SUBMARINE ADVENTURE 潛遊樂園"],["farm","FAMILY FARM 親子農莊"],["glamping","GLAMPING LAWN 秘境花園"],["seashore","THE SEASHORE 淳海廳"],["lagoon","THE LAGOON 瀚海廳"],["gym","APEX GYM 活力健身室"],["surf-arena","i-SURF ARENA 互動風帆館"],["run-arena","i-RUN ARENA 互動跑步館"],["yoga","ASANA ROOM 瑜伽活動室"],["furryland","FURRYLAND 萌寵樂園"],["pet-grooming","PAWS N' CLAWS 萌寵造型室"],["band-room","THE BEAT LAB 節拍空間"],["coworking","THE COMMONS 共享工作間"],["marina","THE MARINA 澄海廳"],["serene-garden","SERENE GARDEN 靜謐庭園"]],
  cn: [["lounge","COZY LOUNGE 逸意雅座"],["pool","AZURE POOL 天蓝泳池"],["whale-park","WHALE PARK 鲸乐天地"],["submarine","SUBMARINE ADVENTURE 潜游乐园"],["farm","FAMILY FARM 亲子农庄"],["glamping","GLAMPING LAWN 秘境花园"],["seashore","THE SEASHORE 淳海厅"],["lagoon","THE LAGOON 瀚海厅"],["gym","APEX GYM 活力健身室"],["surf-arena","i-SURF ARENA 互动风帆馆"],["run-arena","i-RUN ARENA 互动跑步馆"],["yoga","ASANA ROOM 瑜伽活动室"],["furryland","FURRYLAND 萌宠乐园"],["pet-grooming","PAWS N' CLAWS 萌宠造型室"],["band-room","THE BEAT LAB 节拍空间"],["coworking","THE COMMONS 共享工作间"],["marina","THE MARINA 澄海厅"],["serene-garden","SERENE GARDEN 静谧庭园"]],
  en: [["lounge","COZY LOUNGE"],["pool","AZURE POOL"],["whale-park","WHALE PARK"],["submarine","SUBMARINE ADVENTURE"],["farm","FAMILY FARM"],["glamping","GLAMPING LAWN"],["seashore","THE SEASHORE"],["lagoon","THE LAGOON"],["gym","APEX GYM"],["surf-arena","i-SURF ARENA"],["run-arena","i-RUN ARENA"],["yoga","ASANA ROOM"],["furryland","FURRYLAND"],["pet-grooming","PAWS N' CLAWS"],["band-room","THE BEAT LAB"],["coworking","THE COMMONS"],["marina","THE MARINA"],["serene-garden","SERENE GARDEN"]]
};
const fac = (l) => FAC[l === 'hk' ? 'hk' : (l === 'cn' ? 'cn' : 'en')].map(f => ['assets/img/facilities/' + f[0] + '.webp', f[1]]);

const atlasBlocks = {
  hk: {
    title: "星級園林會所及建築工藝",
    sub: "THE ATLAS 擎海",
    club: {
      kicker: "INDULGE IN THE BLISS OF AN URBAN-RESORT CLUBHOUSE",
      title: "奢雅會所 展現生活格調",
      body: [
        "尊貴住客會所 CLUB ATLAS" + S(1) + "，會所連園林總面積逾83,000平方呎" + S(2) + "，由國際知名室內設計團隊 ARK" + S(3) + " 與園境設計團隊 OTHERLAND" + S(3) + " 聯手締造。",
        "住客會所" + S(1) + "設計以「LIVING WITH THE SEA」為核心理念，細訴「海洋、家庭、健康」三大主題。空間巧妙運用藍色弧形線條及波浪元素，透過幾何與自然的對話，為住戶構築愜意自在的奢雅天地。",
        "項目特設雙住客會所" + S(1) + "，以全天候24小時開放" + S(4) + "的行人天橋" + S(4) + "貫通相連。住客會所雲集逾30項動靜皆宜的多元設施" + S(1) + "，滿足不同住戶的生活節奏。"
      ]
    },
    facilities: fac('hk'),
    facilitiesNote: "模擬效果圖 — 圖像經電腦修飾處理，並非按照比例繪製，僅供參考。會所、園境及康樂設施名稱為推廣名稱，詳情請參閱附註及售樓說明書。",
    arch: {
      kicker: "NATURE-INSPIRED BESPOKE ARCHITECTURE",
      title: "自然為語 匠心建築設計",
      body: [
        "THE ATLAS 擎海 凝聚全球頂尖設計團隊的匠心智慧，將維港海景" + S(5) + "、自然風貌及文化底蘊巧妙交織於建築、室內及景觀之中；以人為本的規劃理念，完美呈現自然與工藝美學的和諧交融。",
        "國際知名建築設計團隊 P&T GROUP" + S(3) + " 採用淺藍色玻璃幕牆，映照維港海天一色" + S(5) + "，成就標誌性地標。項目匠心打造雙層挑高玻璃入口，引入充沛自然光線及盎然綠意，建築與景觀相互融合。白晝陽光灑落，夜幕下燈光柔和溢出，與都會景致" + S(5) + "自然交融，彰顯宏涵優雅的氣度。"
      ],
      teams: "P&T GROUP · ARK · OTHERLAND",
      img: "assets/img/facilities/entrance.webp",
      imgCaption: "「THE ATLAS 擎海」— 模擬效果圖"
    },
    fittings: {
      kicker: "PREMIER PROVISIONS FOR SPLENDID LIVING",
      title: "國際頂級廚衛家電 薈萃璀璨生活",
      body: [
        "設計師匠心細琢每一寸細節，住宅單位玻璃幕墻採用低輻射鍍膜（Low-E）" + S(6) + "中空玻璃設計，兼具卓越的隔熱、隔音與節能功效。",
        "住宅單位配備國際級廚房及衛浴設備，包括德國 MIELE 爐具及雪櫃" + S(7) + "、德國 GAGGENAU 洗衣乾衣機" + S(7) + "、美國 KOHLER 衛浴配備" + S(7) + "、日本 DAIKIN 冷氣機" + S(7) + "及日本 PANASONIC 浴室寶" + S(7) + "，由內而外詮釋非凡生活品味。"
      ]
    },
    brands: [
      ["assets/img/brands/miele.webp", "MIELE 爐具及雪櫃 · 德國"],
      ["assets/img/brands/gaggenau.webp", "GAGGENAU 洗衣乾衣機 · 德國"],
      ["assets/img/brands/kohler.webp", "KOHLER 衛浴配備 · 美國"],
      ["assets/img/brands/daikin.webp", "DAIKIN 冷氣機 · 日本"],
      ["assets/img/brands/panasonic.webp", "PANASONIC 浴室寶 · 日本"]
    ],
    factsTitle: "項目資料",
    facts: factsHK,
    disclaimer: "以上資料摘錄自售樓說明書及賣方公開資料，僅供參考；一切以賣方正式公佈及售樓說明書為準。",
    notesTitle: "附註 / Notes"
  },
  cn: {
    title: "星级园林会所及建筑工艺",
    sub: "THE ATLAS 擎海",
    club: {
      kicker: "INDULGE IN THE BLISS OF AN URBAN-RESORT CLUBHOUSE",
      title: "奢雅会所 展现生活格调",
      body: [
        "尊贵住客会所 CLUB ATLAS" + S(1) + "，会所连园林总面积逾83,000平方呎" + S(2) + "，由国际知名室内设计团队 ARK" + S(3) + " 与园境设计团队 OTHERLAND" + S(3) + " 联手缔造。",
        "住客会所" + S(1) + "设计以「LIVING WITH THE SEA」为核心理念，细诉「海洋、家庭、健康」三大主题。空间巧妙运用蓝色弧形线条及波浪元素，透过几何与自然的对话，为住户构筑惬意自在的奢雅天地。",
        "项目特设双住客会所" + S(1) + "，以全天候24小时开放" + S(4) + "的行人天桥" + S(4) + "贯通相连。住客会所云集逾30项动静皆宜的多元设施" + S(1) + "，满足不同住户的生活节奏。"
      ]
    },
    facilities: fac('cn'),
    facilitiesNote: "模拟效果图 — 图像经电脑修饰处理，并非按照比例绘制，仅供参考。会所、园境及康乐设施名称为推广名称，详情请参阅附注及售楼说明书。",
    arch: {
      kicker: "NATURE-INSPIRED BESPOKE ARCHITECTURE",
      title: "自然为语 匠心建筑设计",
      body: [
        "THE ATLAS 擎海 凝聚全球顶尖设计团队的匠心智慧，将维港海景" + S(5) + "、自然风貌及文化底蕴巧妙交织于建筑、室内及景观之中；以为本的规划理念，完美呈现自然与工艺美学的和谐交融。",
        "国际知名建筑设计团队 P&T GROUP" + S(3) + " 采用浅蓝色玻璃幕墙，映照维港海天一色" + S(5) + "，成就标志性地标。项目匠心打造双层挑高玻璃入口，引入充沛自然光线及盎然绿意，建筑与景观相互融合。白昼阳光洒落，夜幕下灯光柔和溢出，与都会景致" + S(5) + "自然交融，彰显宏涵优雅的气度。"
      ],
      teams: "P&T GROUP · ARK · OTHERLAND",
      img: "assets/img/facilities/entrance.webp",
      imgCaption: "「THE ATLAS 擎海」— 模拟效果图"
    },
    fittings: {
      kicker: "PREMIER PROVISIONS FOR SPLENDID LIVING",
      title: "国际顶级厨卫家电 荟萃璀璨生活",
      body: [
        "设计师匠心细琢每一寸细节，住宅单位玻璃幕墙采用低辐射镀膜（Low-E）" + S(6) + "中空玻璃设计，兼具卓越的隔热、隔音与节能功效。",
        "住宅单位配备国际级厨房及卫浴设备，包括德国 MIELE 炉具及雪柜" + S(7) + "、德国 GAGGENAU 洗衣干衣机" + S(7) + "、美国 KOHLER 卫浴配备" + S(7) + "、日本 DAIKIN 冷气机" + S(7) + "及日本 PANASONIC 浴室宝" + S(7) + "，由内而外诠释非凡生活品味。"
      ]
    },
    brands: [
      ["assets/img/brands/miele.webp", "MIELE 炉具及雪柜 · 德国"],
      ["assets/img/brands/gaggenau.webp", "GAGGENAU 洗衣干衣机 · 德国"],
      ["assets/img/brands/kohler.webp", "KOHLER 卫浴配备 · 美国"],
      ["assets/img/brands/daikin.webp", "DAIKIN 冷气机 · 日本"],
      ["assets/img/brands/panasonic.webp", "PANASONIC 浴室宝 · 日本"]
    ],
    factsTitle: "项目资料",
    facts: factsCN,
    disclaimer: "以上资料摘录自售楼说明书及卖方公开资料，仅供参考；一切以卖方正式公布及售楼说明书为准。",
    notesTitle: "附注 / Notes"
  },
  en: {
    title: "Star-grade Clubhouse & Architectural Craftsmanship",
    sub: "THE ATLAS",
    club: {
      kicker: "INDULGE IN THE BLISS OF AN URBAN-RESORT CLUBHOUSE",
      title: "An Elegant Clubhouse, A Statement of Living",
      body: [
        "CLUB ATLAS" + S(1) + ", the prestigious residents' clubhouse, spans a total indoor and landscaped area of over 83,000 square feet" + S(2) + ", jointly crafted by internationally acclaimed interior design team ARK" + S(3) + " and landscape visionaries OTHERLAND" + S(3) + ".",
        "The clubhouse design is centred on the core concept of \u201cLIVING WITH THE SEA\u201d, weaving together three major themes: \u201cOcean, Family, Health\u201d. It skilfully incorporates flowing blue curves and wave-inspired motifs, creating a refined dialogue between geometry and nature.",
        "THE ATLAS features a distinctive dual-clubhouse" + S(1) + " linked by a 24-hour" + S(4) + " all-weather pedestrian skybridge" + S(4) + ". The clubhouse brings together over 30 diverse active and leisure amenities" + S(1) + " to cater to the different rhythms of residents' life."
      ]
    },
    facilities: fac('en'),
    facilitiesNote: "Artist's impressions — images are computer-edited and not drawn to scale, for reference only. Names of clubhouse, landscape and recreational facilities are promotional names; please refer to the notes and the sales brochure for details.",
    arch: {
      kicker: "NATURE-INSPIRED BESPOKE ARCHITECTURE",
      title: "Nature as Language, Bespoke Architectural Design",
      body: [
        "THE ATLAS unites the visionary talents of the world's leading design practices, seamlessly weaving Victoria Harbour's panorama" + S(5) + ", natural scenery and cultural heritage into its architecture, interiors and landscape. Through human-centric planning, it perfectly presents a harmonious blend of nature and craftsmanship aesthetics.",
        "Internationally renowned architectural design team P&T GROUP" + S(3) + " adopts light blue luminous glass curtain walls that mirror the sky and sea of Victoria Harbour" + S(5) + ", creating an iconic landmark. The development meticulously crafts a double-height glass entrance, introducing abundant natural light and verdant greenery to achieve a seamless integration of architecture and landscape. The grand lobby is a study in light — radiant by day, gently luminous by night — artfully bridging indoors and outdoors with the cityscape" + S(5) + "."
      ],
      teams: "P&T GROUP · ARK · OTHERLAND",
      img: "assets/img/facilities/entrance.webp",
      imgCaption: "\u201cTHE ATLAS\u201d — Artist's impression"
    },
    fittings: {
      kicker: "PREMIER PROVISIONS FOR SPLENDID LIVING",
      title: "World-class Kitchen & Bathroom Appliances",
      body: [
        "Every inch of detail is refined by the designer's meticulous craftsmanship. The glass curtain walls of the residential units adopt a low-emissivity (Low-E)" + S(6) + " double-glazed glass design, combining exceptional thermal insulation, acoustic performance and energy efficiency.",
        "The residential units are equipped with international-grade kitchen and bathroom appliances, including MIELE hobs and refrigerators" + S(7) + " (Germany), GAGGENAU washer-dryers" + S(7) + " (Germany), KOHLER bathroom fittings" + S(7) + " (USA), DAIKIN air-conditioners" + S(7) + " (Japan) and PANASONIC bathroom thermo ventilators" + S(7) + " (Japan) — curating an extraordinary lifestyle from the inside out."
      ]
    },
    brands: [
      ["assets/img/brands/miele.webp", "MIELE Hobs & Refrigerators · Germany"],
      ["assets/img/brands/gaggenau.webp", "GAGGENAU Washer-dryers · Germany"],
      ["assets/img/brands/kohler.webp", "KOHLER Bathroom Fittings · USA"],
      ["assets/img/brands/daikin.webp", "DAIKIN Air-conditioners · Japan"],
      ["assets/img/brands/panasonic.webp", "PANASONIC Thermo Ventilators · Japan"]
    ],
    factsTitle: "Project Facts",
    facts: factsEN,
    disclaimer: "The above is extracted from the sales brochure and the Vendor's public materials, for reference only; the Vendor's official publications and the sales brochure shall prevail.",
    notesTitle: "Notes"
  }
};

const locBlocks = {
  hk: {
    title: "位置概覽",
    sub: "九龍東 · 臨海地段",
    heroImg: "assets/img/drone.webp",
    heroNote: "航拍相片 — 本圖像於2026年7月11日攝於油塘附近上空，經電腦修飾及合成處理，僅供參考；圖像並非展示發展項目或其任何部份可享有之景觀。",
    coast: {
      kicker: "SAVOUR VICTORIA HARBOUR'S TIMELESS COASTLINE",
      title: "躍進維港 鑑賞傳世海岸",
      body: [
        "維多利亞港，一覽無遺，海的流動，魚的韻律，動感扣人心弦，印證海濱生活的魅力。",
        "從鯉魚門的人文傳承到維港的浩瀚" + S(1) + "，自然與人文在海浪中交匯輝映，編織成流動的藝術傑作。",
        "置身 THE ATLAS 擎海，在靜與動的微妙和諧裡，以海為彩" + S(1) + "，以岸為框，成就海岸之上永恆流傳的典範。"
      ]
    },
    transit: {
      kicker: "SEAMLESS CONNECTIONS, ENDLESS WAYS TO THRIVE",
      title: "縱橫天下 穿梭多元網絡",
      body: [
        "THE ATLAS 擎海 坐擁四通八達的交通網絡，信步約6分鐘" + S(2) + "即達港鐵油塘站，一站" + S(3) + "盡享三綫" + S(3) + "之便。隨著規劃中的東九龍智慧綠色集體運輸系統" + S(4) + "於2033年通車，油塘將躍升為東九龍三綫交匯" + S(4) + "交通樞紐，鐵路優勢無可比擬。",
        "高效交通網絡，連接九龍東、港島東及中環三大CBD" + S(5) + "，駕車約8分鐘" + S(6) + "直達九龍東核心商業區；約12分鐘" + S(6) + "迅抵港島東核心商業區；約17分鐘" + S(6) + "貫通中環核心商業區，商務往來運籌帷幄。T2主幹路（興建中）" + S(7) + "預計於2026年全面開通，未來接連中九龍幹線，貫通東西九龍，僅需約8分鐘" + S(8) + "直達西九龍，經由高鐵香港西九龍站，暢達全國113個站點" + S(9) + "，盡擁無限機遇。",
        "區內亦設往返西灣河的渡輪服務" + S(10) + "，以及逾160條巴士及小巴路線" + S(11) + "，全方位覆蓋港九新界及機場，實現暢行無憂的都會生活。"
      ],
      stats: [
        [6, "分鐘", "步行至港鐵油塘站" + S(2)],
        [8, "分鐘", "駕車至九龍東CBD" + S(6)],
        [12, "分鐘", "駕車至港島東CBD" + S(6)],
        [17, "分鐘", "駕車至中環CBD" + S(6)],
        [160, "條以上", "巴士及小巴路線" + S(11)],
        [16, "公里", "國際級海濱長廊" + S(13)]
      ],
      mtrTitle: "港鐵路綫圖 — 此路線圖經簡化處理及不按照比例繪製，僅供參考",
      mapTitle: "地圖不按比例繪畫"
    },
    sail: {
      kicker: "SET SAIL FOR A LIFE OF COASTAL ELEGANCE",
      title: "卓然啟航 活出海岸之尚",
      body: [
        "從 THE ATLAS 擎海 啟航，維港兩岸" + S(1) + "—港島與九龍的壯麗海岸" + S(1) + "盡收眼底。沿約16公里" + S(13) + "國際級海濱長廊漫行，鯉魚門的歷史文化地標與傳統漁港風情相映成趣，三家村避風塘的悠然時光，宛如流動的畫廊，將一幅幅經典海岸畫卷徐徐鋪展眼前。",
        "海岸之尚不再是遙遠的夢，生活在這裡，每一天都如揚帆遠航般自由愜意。"
      ],
      photos: [
        ["assets/img/env-1.webp", "三家村避風塘"],
        ["assets/img/env-2.webp", "炮台山（又名魔鬼山）"],
        ["assets/img/env-3.webp", "鯉魚門"],
        ["assets/img/env-4.webp", "鯉魚門觀景台"],
        ["assets/img/env-5.webp", "鯉魚門天后廟"],
        ["assets/img/env-6.webp", "鯉魚門石礦場"]
      ],
      photosNote: "庫存圖片 — 本頁展示之所有庫存圖片均非於發展項目拍攝，亦與發展期數一概無關。"
    },
    soar: {
      kicker: "SOAR ABOVE THE WAVES, A DESTINATION BEYOND THE EXTRAORDINARY",
      title: "翱翔海岸 擁抱非凡地利",
      body: [
        "由 THE ATLAS 擎海 翱翔，在空中俯瞰維港兩岸風光" + S(1) + "，盡覽九龍東與啟德發展區" + S(14) + "的都會面貌，非凡地利，盡在掌握。",
        "九龍東未來都會心臟，逾4,300萬平方呎商業樓面" + S(15) + "蓄勢待發，啟德發展區總規劃面積超過320公頃" + S(16) + "，匯聚世界級地標建築包括啟德體育園" + S(17) + "、啟德郵輪碼頭" + S(18) + "與商貿樞紐，多家跨國企業已早著先機，菁英薈萃九龍東海岸。隨著油塘灣綜合發展區（擬建中）" + S(12) + "陸續推展，住宅、商廈及酒店等沿岸並起，於此繁盛交會之處，築就前瞻未來的優質生活典範。"
      ]
    },
    shop: {
      kicker: "WHERE STYLE AND LEISURE INSPIRE LIFE",
      title: "購物休閒 擁抱豐盛生活",
      body: [
        "THE ATLAS 擎海 坐擁優越地段，輕鬆暢達大本型" + S(19) + "、PopCorn" + S(19) + "、apm" + S(19) + "、德福廣場" + S(19) + "、MegaBox" + S(19) + "、太古城中心" + S(19) + "等逾400萬平方呎" + S(20) + "的多元消閒熱點。匯聚購物、饗宴與娛樂，精彩生活，瞬間啟程。",
        "閒暇時，與摯愛漫步鯉魚門，從天后廟到鯉魚門石礦場，體會百年歷史傳承；探索壁畫藝術村，感受濃郁的文化氣息。由海鮮美食區到衞奕信徑，在自然與文化交融中，遠離煩囂，享受豐盛海岸生活。"
      ]
    },
    notesTitle: "附註 / Notes"
  },
  cn: {
    title: "位置概览",
    sub: "九龙东 · 临海地段",
    heroImg: "assets/img/drone.webp",
    heroNote: "航拍相片 — 本图像于2026年7月11日摄于油塘附近上空，经电脑修饰及合成处理，仅供参考；图像并非展示发展项目或其任何部份可享有之景观。",
    coast: {
      kicker: "SAVOUR VICTORIA HARBOUR'S TIMELESS COASTLINE",
      title: "跃进维港 鉴赏传世海岸",
      body: [
        "维多利亚港，一览无遗，海的流动，鱼的韵律，动感扣人心弦，印证海滨生活的魅力。",
        "从鲤鱼门的人文传承到维港的浩瀚" + S(1) + "，自然与人文在海浪中交汇辉映，编织成流动的艺术杰作。",
        "置身 THE ATLAS 擎海，在静与动的微妙和谐里，以海为彩" + S(1) + "，以岸为框，成就海岸之上永恒流传的典范。"
      ]
    },
    transit: {
      kicker: "SEAMLESS CONNECTIONS, ENDLESS WAYS TO THRIVE",
      title: "纵横天下 穿梭多元网络",
      body: [
        "THE ATLAS 擎海 坐拥四通八达的交通网络，信步约6分钟" + S(2) + "即达港铁油塘站，一站" + S(3) + "尽享三线" + S(3) + "之便。随着规划中的东九龙智慧绿色集体运输系统" + S(4) + "于2033年通车，油塘将跃升为东九龙三线交汇" + S(4) + "交通枢纽，铁路优势无可比拟。",
        "高效交通网络，连接九龙东、港岛东及中环三大CBD" + S(5) + "，驾车约8分钟" + S(6) + "直达九龙东核心商业区；约12分钟" + S(6) + "迅抵港岛东核心商业区；约17分钟" + S(6) + "贯通中环核心商业区，商务往来运筹帷幄。T2主干路（兴建中）" + S(7) + "预计于2026年全面开通，未来接连中九龙干线，贯通东西九龙，仅需约8分钟" + S(8) + "直达西九龙，经由高铁香港西九龙站，畅达全国113个站点" + S(9) + "，尽拥无限机遇。",
        "区内亦设往返西湾河的渡轮服务" + S(10) + "，以及逾160条巴士及小巴路线" + S(11) + "，全方位覆盖港九新界及机场，实现畅行无忧的都会生活。"
      ],
      stats: [
        [6, "分钟", "步行至港铁油塘站" + S(2)],
        [8, "分钟", "驾车至九龙东CBD" + S(6)],
        [12, "分钟", "驾车至港岛东CBD" + S(6)],
        [17, "分钟", "驾车至中环CBD" + S(6)],
        [160, "条以上", "巴士及小巴路线" + S(11)],
        [16, "公里", "国际级海滨长廊" + S(13)]
      ],
      mtrTitle: "港铁路线图 — 此路线图经简化处理及不按照比例绘制，仅供参考",
      mapTitle: "地图不按比例绘画"
    },
    sail: {
      kicker: "SET SAIL FOR A LIFE OF COASTAL ELEGANCE",
      title: "卓然启航 活出海岸之尚",
      body: [
        "从 THE ATLAS 擎海 启航，维港两岸" + S(1) + "—港岛与九龙的壮丽海岸" + S(1) + "尽收眼底。沿约16公里" + S(13) + "国际级海滨长廊漫行，鲤鱼门的历史文化地标与传统渔港风情相映成趣，三家村避风塘的悠然时光，宛如流动的画廊，将一幅幅经典海岸画卷徐徐铺展眼前。",
        "海岸之尚不再是遥远的梦，生活在这里，每一天都如扬帆远航般自由惬意。"
      ],
      photos: [
        ["assets/img/env-1.webp", "三家村避风塘"],
        ["assets/img/env-2.webp", "炮台山（又名魔鬼山）"],
        ["assets/img/env-3.webp", "鲤鱼门"],
        ["assets/img/env-4.webp", "鲤鱼门观景台"],
        ["assets/img/env-5.webp", "鲤鱼门天后庙"],
        ["assets/img/env-6.webp", "鲤鱼门石矿场"]
      ],
      photosNote: "库存图片 — 本页展示之所有库存图片均非于发展项目拍摄，亦与发展期数一概无关。"
    },
    soar: {
      kicker: "SOAR ABOVE THE WAVES, A DESTINATION BEYOND THE EXTRAORDINARY",
      title: "翱翔海岸 拥抱非凡地利",
      body: [
        "由 THE ATLAS 擎海 翱翔，在空中俯瞰维港两岸风光" + S(1) + "，尽览九龙东与启德发展区" + S(14) + "的都会面貌，非凡地利，尽在掌握。",
        "九龙东未来都会心脏，逾4,300万平方呎商业楼面" + S(15) + "蓄势待发，启德发展区总规划面积超过320公顷" + S(16) + "，汇聚世界级地标建筑包括启德体育园" + S(17) + "、启德邮轮码头" + S(18) + "与商贸枢纽，多家跨国企业已早着先机，菁英荟萃九龙东海岸。随着油塘湾综合发展区（拟建中）" + S(12) + "陆续推展，住宅、商厦及酒店等沿岸并起，于此繁盛交会之处，筑就前瞻未来的优质生活典范。"
      ]
    },
    shop: {
      kicker: "WHERE STYLE AND LEISURE INSPIRE LIFE",
      title: "购物休闲 拥抱丰盛生活",
      body: [
        "THE ATLAS 擎海 坐拥优越地段，轻松畅达大本型" + S(19) + "、PopCorn" + S(19) + "、apm" + S(19) + "、德福广场" + S(19) + "、MegaBox" + S(19) + "、太古城中心" + S(19) + "等逾400万平方呎" + S(20) + "的多元消闲热点。汇聚购物、飨宴与娱乐，精彩生活，瞬间启程。",
        "闲暇时，与挚爱漫步鲤鱼门，从天后庙到鲤鱼门石矿场，体会百年历史传承；探索壁画艺术村，感受浓郁的文化气息。由海鲜美食区到卫奕信径，在自然与文化交融中，远离烦嚣，享受丰盛海岸生活。"
      ]
    },
    notesTitle: "附注 / Notes"
  },
  en: {
    title: "Location",
    sub: "Kowloon East · Harbourfront",
    heroImg: "assets/img/drone.webp",
    heroNote: "Aerial photo — taken over the vicinity of Yau Tong on 11 July 2026, digitally retouched and composited, for reference only; the image does not show any view that may be enjoyed by the development or any part thereof.",
    coast: {
      kicker: "SAVOUR VICTORIA HARBOUR'S TIMELESS COASTLINE",
      title: "Embrace Victoria Harbour's Timeless Coastline",
      body: [
        "Victoria Harbour unfolds in all its splendour — where the rhythmic ebb and flow of the tides mirrors the vibrant pulse of waterfront living.",
        "From the storied heritage of Lei Yue Mun to the majestic breadth of the harbour" + S(1) + ", nature and culture converge upon the waves, weaving a living tapestry of art.",
        "Poised at THE ATLAS in perfect equilibrium between stillness and motion, the sea" + S(1) + " becomes your palette and the shore your frame — an ever-evolving masterpiece along the coastline."
      ]
    },
    transit: {
      kicker: "SEAMLESS CONNECTIONS, ENDLESS WAYS TO THRIVE",
      title: "Seamless Connections, Endless Ways to Thrive",
      body: [
        "THE ATLAS is superbly connected, putting the city at your feet. A leisurely six-minute stroll" + S(2) + " brings you to MTR Yau Tong Station, offering ultimate convenience with seamless access to three MTR lines" + S(3) + " within a single stop. With the planned Smart and Green Mass Transit System" + S(4) + " in East Kowloon scheduled for completion in 2033, Yau Tong is set to elevate into a premier transit hub connecting three railway lines" + S(4) + ", delivering unparalleled connectivity.",
        "A high-efficiency transport network links the three major CBDs" + S(5) + " of Kowloon East, Island East and Central. By car, it takes approximately 8 minutes" + S(6) + " to reach Kowloon East CBD, about 12 minutes" + S(6) + " to Island East CBD, and about 17 minutes" + S(6) + " to Central CBD — putting business effortlessly within your grasp. Trunk Road T2 (under construction)" + S(7) + ", targeted for full completion in 2026, will link with the Central Kowloon Route to seamlessly connect East and West Kowloon; a mere 8-minute drive" + S(8) + " reaches West Kowloon, where the High Speed Rail Hong Kong West Kowloon Station connects directly to 113 destinations" + S(9) + " across Mainland China, unlocking endless opportunities.",
        "Complemented by ferry services to Sai Wan Ho" + S(10) + " and over 160 bus and minibus routes" + S(11) + ", the location provides comprehensive coverage across Hong Kong Island, Kowloon, the New Territories and the airport, delivering an effortlessly connected urban lifestyle."
      ],
      stats: [
        [6, "MIN", "STROLL TO MTR YAU TONG" + S(2)],
        [8, "MIN", "DRIVE TO KOWLOON EAST CBD" + S(6)],
        [12, "MIN", "DRIVE TO ISLAND EAST CBD" + S(6)],
        [17, "MIN", "DRIVE TO CENTRAL CBD" + S(6)],
        [160, "+", "BUS & MINIBUS ROUTES" + S(11)],
        [16, "KM", "WATERFRONT PROMENADE" + S(13)]
      ],
      mtrTitle: "MTR System Map — simplified and not drawn to scale, for reference only",
      mapTitle: "Map not drawn to scale"
    },
    sail: {
      kicker: "SET SAIL FOR A LIFE OF COASTAL ELEGANCE",
      title: "Set Sail for a Life of Coastal Elegance",
      body: [
        "Setting sail from THE ATLAS, the magnificent shorelines of both Hong Kong Island and Kowloon across Victoria Harbour" + S(1) + " unfurl before you. Wander along the approximately 16-kilometre" + S(13) + " world-class waterfront promenade, where the historic cultural landmarks and traditional fishing village charm of Lei Yue Mun complement one another; the tranquil pace of Sam Ka Tsuen Typhoon Shelter unfolds like a living gallery, gracefully revealing classic coastal vistas at every turn.",
        "Coastal elegance is no longer a distant dream. Living here, every day feels as free, breezy and effortlessly inspired as setting sail."
      ],
      photos: [
        ["assets/img/env-1.webp", "Sam Ka Tsuen Typhoon Shelter"],
        ["assets/img/env-2.webp", "Devil's Peak"],
        ["assets/img/env-3.webp", "Lei Yue Mun"],
        ["assets/img/env-4.webp", "Lei Yue Mun Viewing Deck"],
        ["assets/img/env-5.webp", "Tin Hau Temple, Lei Yue Mun"],
        ["assets/img/env-6.webp", "Lei Yue Mun Quarry"]
      ],
      photosNote: "Stock images — all stock images shown are not taken at the development and are unrelated to the phase(s)."
    },
    soar: {
      kicker: "SOAR ABOVE THE WAVES, A DESTINATION BEYOND THE EXTRAORDINARY",
      title: "Soar Above the Waves, A Destination Beyond the Extraordinary",
      body: [
        "Soar above THE ATLAS and behold the sweeping panoramic views of both sides of Victoria Harbour" + S(1) + ", commanding the vibrant urban landscapes of Kowloon East and the Kai Tak Development Area" + S(14) + " with extraordinary location and convenience entirely within your grasp.",
        "Kowloon East is the metropolitan heart of the future, with over 43 million square feet of commercial space" + S(15) + " taking shape; the Kai Tak Development Area spans more than 320 hectares" + S(16) + ", converging world-class landmarks including the Kai Tak Sports Park" + S(17) + ", the Kai Tak Cruise Terminal" + S(18) + " and thriving commercial hubs. Global enterprises have already seized the opportunity, gathering top-tier talent along the Kowloon East coastline. As the proposed Yau Tong Bay Comprehensive Development Area (proposed)" + S(12) + " gradually unfolds with residential properties, commercial towers and hotels rising along the coast, this flourishing convergence creates a paradigm of premier waterfront living looking to the future."
      ]
    },
    shop: {
      kicker: "WHERE STYLE AND LEISURE INSPIRE LIFE",
      title: "Where Style and Leisure Inspire Life",
      body: [
        "THE ATLAS boasts a coveted location, placing over 4 million square feet" + S(20) + " of diverse retail and leisure destinations" + S(19) + " at your doorstep — Domain" + S(19) + ", PopCorn" + S(19) + ", apm" + S(19) + ", Telford Plaza" + S(19) + ", MegaBox" + S(19) + ", Cityplaza" + S(19) + " and more. Bringing together shopping, dining and entertainment, an extraordinary life begins in an instant.",
        "In your leisure time, stroll through Lei Yue Mun — from Tin Hau Temple to the Lei Yue Mun Stone Quarry — and embrace a century of historical heritage. Explore the Mural Art Village and immerse yourself in a rich cultural atmosphere. From the famous seafood dining area to Wilson Trail, enjoy a rewarding coastal lifestyle where nature and culture seamlessly intertwine."
      ]
    },
    notesTitle: "Notes"
  }
};

/* ---------- 替换 atlas 区块（依语言顺序） ---------- */
const langOrder = ['hk', 'cn', 'en'];
let ai = 0;
s = s.replace(/    atlas: \{[\s\S]*?\n    \},\n(?=    location: \{)/g, function () {
  const b = atlasBlocks[langOrder[ai++]];
  return '    atlas: ' + ser(b, 0).replace(/\n/g, '\n    ') + '\n';
});

/* ---------- 替换 location 区块 ---------- */
let li = 0;
s = s.replace(/    location: \{[\s\S]*?\n    \},\n(?=    sales: \{)/g, function () {
  const b = locBlocks[langOrder[li++]];
  return '    location: ' + ser(b, 0).replace(/\n/g, '\n    ') + '\n';
});

fs.writeFileSync(p, s, 'utf8');
console.log('atlas replaced:', ai, '| location replaced:', li);