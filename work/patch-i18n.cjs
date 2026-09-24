// 一次性脚本：为 i18n.js 三语块补入 location.transportTitle / media.envTitle / media.envPhotos / legal 弹窗文案
const fs = require('fs');
const p = 'assets/js/i18n.js';
let s = fs.readFileSync(p, 'utf8');

const legalHK = [
  '發展項目期數的名稱：擎海（「發展項目」）的第1期（「期數」）。｜區域：茶果嶺、油塘、鯉魚門｜期數位於的街道名稱及門牌號數：東源街23號^｜賣方就期數指定的互聯網網站的網址：WWW.THEATLAS.HK/PHASE1#｜本廣告/宣傳資料內載列的相片、圖像、繪圖或素描顯示純屬畫家對有關發展項目之想像。有關相片、圖像、繪圖或素描並非按照比例繪畫及/或可能經過電腦修飾處理。準買家如欲了解發展項目的詳情，請參閱售樓說明書。賣方亦建議準買家到有關發展地盤作實地考察，以對該發展地盤、其周邊地區環境及附近的公共設施有較佳了解。',
  '賣方：俊英發展有限公司｜賣方的控權公司：越秀地產（香港）有限公司、越龍控股有限公司、越秀地產股份有限公司｜期數的認可人士︰陳韻明｜期數的認可人士以其專業身份擔任經營人、董事或僱員的商號或法團：巴馬丹拿建築師有限公司｜期數的承建商︰其士建築（香港）有限公司｜就期數中的住宅物業的出售而代表擁有人行事的律師事務所︰的近律師行｜已為期數的建造提供貸款或已承諾為該項建造提供融資的認可機構︰興業銀行股份有限公司（於中國註冊成立的股份有限公司），透過其香港分行行事｜已為期數的建造提供貸款的任何其他人︰不適用｜盡賣方所知的期數的預計關鍵日期︰2028年12月30日（「關鍵日期」指批地文件的條件就期數而獲符合的日期，預計關鍵日期由期數的認可人士提供。預計關鍵日期是受到買賣合約所允許的任何延期所規限的。）｜賣方建議準買方參閱有關售樓說明書，以了解發展項目/期數的資料。詳情請參閱售樓說明書。｜^臨時門牌號數有待期數落成時確認。｜#賣方為施行《一手住宅物業銷售條例》第2部而就期數指定的互聯網網站的網址。｜本廣告/宣傳資料由賣方發布。｜本廣告/宣傳資料及其內容僅供參考，並不構成亦不得被詮釋成賣方作出任何不論明示或隱含之合約條款、要約、陳述、承諾或保證。｜最後更新日期：2026年9月21日'
];

const legalCN = [
  '发展项目期数的名称：擎海（「发展项目」）的第1期（「期数」）。｜区域：茶果岭、油塘、鲤鱼门｜期数位于的街道名称及门牌号数：东源街23号^｜卖方就期数指定的互联网网站的网址：WWW.THEATLAS.HK/PHASE1#｜本广告/宣传资料内载列的相片、图像、绘图或素描显示纯属画家对有关发展项目之想像。有关相片、图像、绘图或素描并非按照比例绘画及/或可能经过电脑修饰处理。准买家如欲了解发展项目的详情，请参阅售楼说明书。卖方亦建议准买家到有关发展地盘作实地考察，以对该发展地盘、其周边地区环境及附近的公共设施有较佳了解。',
  '卖方：俊英发展有限公司｜卖方的控权公司：越秀地产（香港）有限公司、越龙控股有限公司、越秀地产股份有限公司｜期数的认可人士：陈韵明｜期数的认可人士以其专业身份担任经营人、董事或雇员的商号或法团：巴马丹拿建筑师有限公司｜期数的承建商：其士建筑（香港）有限公司｜就期数中的住宅物业的出售而代表拥有人行事的律师事务所：的近律师行｜已为期数的建造提供贷款或已承诺为该项建造提供融资的认可机构：兴业银行股份有限公司（于中国注册成立的股份有限公司），透过其香港分行行事｜已为期数的建造提供贷款的任何其他人：不适用｜尽卖方所知的期数的预计关键日期：2028年12月30日（「关键日期」指批地文件的条件就期数而获符合的日期，预计关键日期由期数的认可人士提供。预计关键日期是受到买卖合约所允许的任何延期所规限的。）｜卖方建议准买方参阅有关售楼说明书，以了解发展项目/期数的资料。详情请参阅售楼说明书。｜^临时门牌号数有待期数落成时确认。｜#卖方为施行《一手住宅物业销售条例》第2部而就期数指定的互联网网站的网址。｜本广告/宣传资料由卖方发布。｜本广告/宣传资料及其内容仅供参考，并不构成亦不得被诠释成卖方作出任何不论明示或隐含之合约条款、要约、陈述、承诺或保证。｜最后更新日期：2026年9月21日'
];

const legalEN = [
  'Name of Phase of the Development: Phase 1 (the "Phase") of THE ATLAS (the "Development"). | District: Cha Kwo Ling, Yau Tong, Lei Yue Mun | Name of Street at which the Phase is situated and Street Number: 23 Tung Yuen Street^ | Address of website designated by the Vendor for the Phase: WWW.THEATLAS.HK/PHASE1# | The photographs, images, drawings or sketches shown in this advertisement/promotional material represent an artist\u2019s impression of the development concerned only. They are not drawn to scale and/or may have been edited and processed with computerized imaging techniques. Prospective purchasers should make reference to the sales brochure for details of the development. The Vendor also advises prospective purchasers to conduct an on-site visit for a better understanding of the development site, its surrounding environment and the public facilities nearby.',
  'Vendor: Charm Smart Development Limited | Holding Companies of the Vendor: Yuexiu Property (HK) Company Limited, Dragon Yield Holding Limited, Yuexiu Property Company Limited | Authorized Person for the Phase: Chan Wan Ming | The firm or corporation of which the Authorized Person for the Phase is a proprietor, director or employee in his or her professional capacity: P&T Architects Limited | Building Contractor for the Phase: Chevalier Construction (Hong Kong) Limited | The firm of solicitors acting for the owner in relation to the sale of residential properties in the Phase: Deacons | Authorized institution that has made a loan, or has undertaken to provide finance, for the construction of the Phase: Industrial Bank Co., Ltd. (a joint stock company incorporated in P.R.C. with limited liability), acting through its Hong Kong Branch | Other person who has made a loan for the construction of the Phase: Not applicable | To the best of the Vendor\u2019s knowledge, the estimated material date for the Phase: 30 December 2028 ("Material date" means the date on which the conditions of the land grant are complied with in respect of the Phase. The estimated material date is provided by the Authorized Person for the Phase. The estimated material date is subject to any extension of time that is permitted under the Agreement for Sale and Purchase.) | Prospective purchasers are advised to refer to the sales brochure for any information on the Development/Phase. Please refer to the sales brochure for details. | ^Provisional street number subject to confirmation upon completion of the Phase. | #Address of website designated by the Vendor for the Phase for the purposes of Part 2 of the Residential Properties (First-hand Sales) Ordinance. | This advertisement/promotional material is published by the Vendor. | This advertisement/promotional material and its contents are for reference only, and shall not constitute or be construed as constituting any offer, undertaking, representation or warranty, whether express or implied, by the Vendor. | Date of update: 21 September 2026'
];

function legalBlock(title, paragraphs, closeLabel) {
  return '    legal: {\n' +
    '      title: ' + JSON.stringify(title) + ',\n' +
    '      close: ' + JSON.stringify(closeLabel) + ',\n' +
    '      paragraphs: [\n' +
    paragraphs.map(function (t) { return '        ' + JSON.stringify(t); }).join(',\n') + '\n' +
    '      ]\n' +
    '    },\n';
}

// 1) location.transportTitle
s = s.replace('      p1: "項目位於九龍東茶果嶺、油塘及鯉魚門一帶臨海地段。",',
  '      p1: "項目位於九龍東茶果嶺、油塘及鯉魚門一帶臨海地段。",\n      transportTitle: "交通網絡",');
s = s.replace('      p1: "项目位于九龙东茶果岭、油塘及鲤鱼门一带临海地段。",',
  '      p1: "项目位于九龙东茶果岭、油塘及鲤鱼门一带临海地段。",\n      transportTitle: "交通网络",');
s = s.replace('      p1: "The Development is located in the harbourfront area of Cha Kwo Ling, Yau Tong and Lei Yue Mun, Kowloon East.",',
  '      p1: "The Development is located in the harbourfront area of Cha Kwo Ling, Yau Tong and Lei Yue Mun, Kowloon East.",\n      transportTitle: "Connectivity",');

// 2) media.envTitle / envPhotos / otherTitle
const envHK = '      envTitle: "環境照片",\n' +
  '      otherTitle: "其他媒體",\n' +
  '      envPhotos: [\n' +
  '        ["assets/img/env-1.webp", "項目環境照片 1"],\n' +
  '        ["assets/img/env-2.webp", "項目環境照片 2"],\n' +
  '        ["assets/img/env-3.webp", "項目環境照片 3"],\n' +
  '        ["assets/img/env-4.webp", "項目環境照片 4"],\n' +
  '        ["assets/img/env-5.webp", "項目環境照片 5"],\n' +
  '        ["assets/img/env-6.webp", "項目環境照片 6"]\n' +
  '      ],\n';
const envCN = envHK.replace('環境照片', '环境照片').replace('其他媒體', '其他媒体')
  .replace('項目環境照片 1', '项目环境照片 1').replace('項目環境照片 2', '项目环境照片 2')
  .replace('項目環境照片 3', '项目环境照片 3').replace('項目環境照片 4', '项目环境照片 4')
  .replace('項目環境照片 5', '项目环境照片 5').replace('項目環境照片 6', '项目环境照片 6');
const envEN = '      envTitle: "Environmental Photos",\n' +
  '      otherTitle: "Other Media",\n' +
  '      envPhotos: [\n' +
  '        ["assets/img/env-1.webp", "Surrounding environment photo 1"],\n' +
  '        ["assets/img/env-2.webp", "Surrounding environment photo 2"],\n' +
  '        ["assets/img/env-3.webp", "Surrounding environment photo 3"],\n' +
  '        ["assets/img/env-4.webp", "Surrounding environment photo 4"],\n' +
  '        ["assets/img/env-5.webp", "Surrounding environment photo 5"],\n' +
  '        ["assets/img/env-6.webp", "Surrounding environment photo 6"]\n' +
  '      ],\n';

s = s.replace('      title: "媒體資料庫",\n      sub: "圖像及影片",\n      p1: "項目圖像、效果圖及宣傳影片將於正式推出後上載。",\n',
  '      title: "媒體資料庫",\n      sub: "圖像及影片",\n      p1: "項目圖像、效果圖及宣傳影片將於正式推出後上載。",\n' + envHK);
s = s.replace('      title: "媒体资料库",\n      sub: "图像及影片",\n      p1: "项目图像、效果图及宣传影片将于正式推出后上载。",\n',
  '      title: "媒体资料库",\n      sub: "图像及影片",\n      p1: "项目图像、效果图及宣传影片将于正式推出后上载。",\n' + envCN);
s = s.replace('      title: "Media Library",\n      sub: "Images & Videos",\n      p1: "Project images, renderings and promotional videos will be uploaded upon official launch.",\n',
  '      title: "Media Library",\n      sub: "Images & Videos",\n      p1: "Project images, renderings and promotional videos will be uploaded upon official launch.",\n' + envEN);

// 3) legal blocks（插在 footer 之前）
s = s.replace('    footer: {\n      disclaimerTitle: "免責聲明 / Disclaimer",',
  legalBlock('免責聲明', legalHK, '關閉') + '    footer: {\n      disclaimerTitle: "免責聲明 / Disclaimer",');
s = s.replace('    footer: {\n      disclaimerTitle: "免责声明 / Disclaimer",',
  legalBlock('免责声明', legalCN, '关闭') + '    footer: {\n      disclaimerTitle: "免责声明 / Disclaimer",');
s = s.replace('    footer: {\n      disclaimerTitle: "Disclaimer",',
  legalBlock('Disclaimer', legalEN, 'Close') + '    footer: {\n      disclaimerTitle: "Disclaimer",');

fs.writeFileSync(p, s, 'utf8');
console.log('legal blocks:', (s.match(/    legal: \{/g) || []).length);
console.log('envTitle:', (s.match(/envTitle:/g) || []).length);
console.log('transportTitle:', (s.match(/transportTitle:/g) || []).length);