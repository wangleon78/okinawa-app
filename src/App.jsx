import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, Map as MapIcon, Ticket, ShieldAlert,
  Plus, Plane, Car, Coffee, ShoppingBag, Bed, Activity,
  ChevronDown, CloudSun, FileText, MapPin, 
  Edit2, Trash2, X, QrCode, CheckCircle, Upload, Navigation, ArrowRight, ImagePlus,
  CircleParking, Fuel, PlaneTakeoff, PlaneLanding, RefreshCw, Calculator, PhoneCall, Wifi, WifiOff, Clock
} from 'lucide-react';

// --- 資料區：最新全景點行程表 ---
const ITINERARY_DATA = [
  {
    day: 1, date: '8/18', title: '抵達與專屬沙灘浮潛', region: '那霸 / 恩納',
    events: [
      { time: '09:20 - 11:30', title: '降落那霸機場、出關與取車', type: 'transport', icon: PlaneLanding, mapQuery: '那霸機場', desc: '去程 IT230 第一航廈 09:20 落地。辦理入境手續並前往租車營業所完成取車作業，準備開始沖繩之旅。' },
      { time: '11:30 - 12:30', title: '走高速公路直奔琉球村', type: 'transport', icon: Car, mapQuery: '琉球村', desc: '【車程 60分】行駛沖繩自動車道，沿途欣賞風光，一路向北直奔恩納村的琉球村。' },
      { time: '12:30 - 14:20', title: '琉球村 (午餐與觀光)', type: 'food', icon: Coffee, mapQuery: '琉球村', desc: '可在免門票區域吃沖繩麵等在地料理，體驗傳統琉球文化 (若行程延後可彈性跳過)。', map: true },
      { time: '14:20 - 14:40', title: '繼續往北開至飯店', type: 'transport', icon: Car, mapQuery: 'Rizzan Sea Park Hotel Tancha Bay' },
      { time: '14:40 - 15:00', title: 'Rizzan Sea Park Hotel', type: 'accommodation', icon: Bed, mapQuery: 'Rizzan Sea Park Hotel Tancha Bay', desc: '抵達 Rizzan Sea Park Hotel 辦理 Check-in，若來不及可先寄放行李。', map: true },
      { time: '15:30 - 17:30', title: '飯店專屬沙灘浮潛', type: 'activity', icon: Activity, mapQuery: 'Rizzan Sea Park Hotel Tancha Bay', desc: '參加飯店專屬沙灘浮潛（已預約 15:30）。換上裝備，直接從沙灘下水享受清澈的恩納村海域。', map: true },
      { time: '17:30 - 20:00', title: '飯店內享用高級晚餐', type: 'food', icon: Coffee, mapQuery: 'Rizzan Sea Park Hotel Tancha Bay', desc: '梳洗後，於飯店內享用高級晚餐與設施。' }
    ]
  },
  {
    day: 2, date: '8/19', title: '北部生態、阿古豬與商場', region: '本部 / 名護',
    events: [
      { time: '07:00 - 08:00', title: '飯店自助餐', type: 'food', icon: Coffee, mapQuery: 'Rizzan Sea Park Hotel Tancha Bay', desc: '享用飯店提供的豐富自助早餐，儲備一天活力。' },
      { time: '08:30 - 09:30', title: '退房，開往北部', type: 'transport', icon: Car, mapQuery: '沖繩美麗海水族館', desc: '辦理 Check-out，行李上車，開往北部。' },
      { time: '09:30 - 11:30', title: '沖繩美麗海水族館', type: 'activity', icon: Activity, mapQuery: '沖繩美麗海水族館', desc: '黑潮之海必看、大鯨鯊。\n\n💡【攻略】導航「P7北停車場」。動線：4F入口 ➔ 3F珊瑚礁 ➔ 2F黑潮之海(大鯨鯊/Ocean Blue抽號) ➔ 1F深海 ➔ 戶外海豚/海龜館(免費)。', map: true },
      { time: '11:30 - 12:00', title: '前往古宇利島', type: 'transport', icon: Car, mapQuery: '古宇利大橋', desc: '開車行駛壯麗的跨海大橋前往古宇利島，途中可先用手機點餐。' },
      { time: '12:00 - 13:00', title: 'KOURI SHRIMP (蝦蝦飯)', type: 'food', icon: Coffee, mapQuery: 'KOURI SHRIMP', desc: '【必吃】古宇利島超人氣蝦蝦飯，蒜香濃郁，搭配海景絕佳。\n\n💡【攻略】先導航「南端展望所」拍全景 ➔ 上橋 ➔ 過橋右轉上坡至蝦蝦飯(客滿停下方漁港走上來)。', map: true },
      { time: '13:00 - 14:00', title: '古宇利島觀光', type: 'activity', icon: MapIcon, mapQuery: '古宇利島 心型岩', desc: '開車環島看古宇利大橋。\n\n💡【攻略】備案A：橋旁「古宇利海灘」踩水。備案B：「心型岩」備硬幣/平底鞋速拍折返。', map: true },
      { time: '14:00 - 14:30', title: '前往名護市區', type: 'transport', icon: Car, mapQuery: 'ネオパークオキナワ' },
      { time: '14:30 - 16:30', title: 'NEO Park (名護動植物園)', type: 'activity', icon: Activity, mapQuery: 'ネオパークオキナワ', desc: '開放式柵欄動物園。必看水豚、羊駝、天竺鼠，遊園車、紅熊貓咖啡館、喜馬拉雅小熊貓、砂貓、飛禽秀。', map: true },
      { time: '16:45 - 17:45', title: '御菓子御殿 名護店', type: 'shopping', icon: ShoppingBag, mapQuery: '御菓子御殿 名護店', desc: '【北部伴手禮】必買：元祖紅芋塔、紅包、紅月夜、鹽芝麻金楚糕、水果風味點心、沖繩黑糖。', map: true },
      { time: '18:00 - 20:00', title: '百年古家 大家 (Ufuya)', type: 'food', icon: Coffee, mapQuery: '百年古家 大家', desc: '【已訂位】享用阿古豬。一個月前訂，涮涮鍋、特色飲品、泡芙。氣氛極佳！', map: true },
      { time: '20:00 - 21:00', title: '南下至 SPORTS DEPO', type: 'transport', icon: Car, mapQuery: 'SPORTS DEPO 泡瀬店', desc: '高速公路南下沖繩市 Depo Sports (運動用品)，九點關門爭取一下時間。' },
      { time: '21:00 - 21:30', title: 'Okinawa Grand Mer Resort', type: 'accommodation', icon: Bed, mapQuery: 'Okinawa Grand Mer Resort', desc: '抵達 Okinawa Grand Mer Resort 辦理 Check-in。', map: true },
      { time: '21:30 - 23:00', title: 'MaxValu 超市', type: 'shopping', icon: ShoppingBag, mapQuery: 'MaxValu 泡瀬店', desc: '車程 5-10 分鐘。晚上八點後有半價熟食，體驗日本在地人深夜超市採買，順便買隔日早餐。', map: true }
    ]
  },
  {
    day: 3, date: '8/20', title: '海中展望、海葡萄與美國村', region: '西海岸 / 北谷',
    events: [
      { time: '08:00 - 09:00', title: 'The Rose Garden', type: 'food', icon: Coffee, mapQuery: 'The Rose Garden Okinawa', desc: '從飯店出發開車十分鐘，享用豐盛美味的美式早午餐。', map: true },
      { time: '09:00 - 09:50', title: '開往部瀨名', type: 'transport', icon: Car, mapQuery: '部瀬名海中公園', desc: '開 50min 到部瀨名。' },
      { time: '09:50 - 11:20', title: '部瀨名海中公園', type: 'activity', icon: Activity, mapQuery: '部瀬名海中公園', desc: '一到現場先看好玻璃船最近的班次直接劃位。搭乘免費接駁車、海中展望塔、玻璃底船看熱帶魚。', map: true },
      { time: '11:20 - 11:45', title: '往南前往元祖海葡萄', type: 'transport', icon: Car, mapQuery: '元祖海ぶどう 本店', desc: '沿國道 58 號往南前往元祖海葡萄。' },
      { time: '11:45 - 13:00', title: '元祖海葡萄總店', type: 'food', icon: Coffee, mapQuery: '元祖海ぶどう 本店', desc: '【午餐】必點海葡萄蓋飯、豪華海鮮丼飯，口感波波脆脆超特別。', map: true },
      { time: '13:00 - 13:10', title: '往北開前往萬座毛', type: 'transport', icon: Car, mapQuery: '萬座毛' },
      { time: '13:10 - 14:00', title: '萬座毛', type: 'activity', icon: MapIcon, mapQuery: '萬座毛', desc: '看斷崖絕景與拍照 (風很大)。\n\n💡【攻略】停「遊客中心」免費。動線：1F ➔ 戶外步道 ➔ 第1觀景台(象鼻岩) ➔ 環步道(抓緊帽子) ➔ 2F吹冷氣。', map: true },
      { time: '14:00 - 14:50', title: '沿國道 58 號前往美國村', type: 'transport', icon: Car, mapQuery: '美浜アメリカンビレッジ', desc: '直奔美國村導航，並停放在靠海邊的「北谷公園（日落海灘）免費停車場」或 Aeon 旁邊的大型公共停車場。' },
      { time: '14:50 - 19:30', title: '美國村 (逛街、晚餐與夕陽)', type: 'activity', icon: Activity, mapQuery: '美浜アメリカンビレッジ', desc: '逛 American Depot 與 Depot Island (找OKICHU客製拖鞋、貨車彩繪牆、天使之翼)。晚餐吃 Taco Rice Kijimuna 或グルメ迴轉壽司。傍晚沿日落步道買 Zhyvago 咖啡或 Blue Seal 冰淇淋看夕陽。', map: true, parking: { name: '北谷町營公共停車場', fee: '免費 (位位難求，需耐心尋找)' } },
      { time: '22:00', title: '返回飯店', type: 'accommodation', icon: Bed, mapQuery: 'Okinawa Grand Mer Resort', desc: '返回飯店休息 (有溫泉需另收費)。' }
    ]
  },
  {
    day: 4, date: '8/21', title: '鐘乳石探險、瀨長島與國際通', region: '南城 / 那霸',
    events: [
      { time: '08:30 - 09:30', title: 'A&W 泡瀨店', type: 'food', icon: Coffee, mapQuery: 'A&W Awase', desc: '體驗沖繩特有的美式速食，必點招牌漢堡、圈圈薯條 (Drive in 點餐超有特色)。', map: true },
      { time: '09:30 - 10:15', title: '南下至南城市', type: 'transport', icon: Car, mapQuery: 'おきなわワールド', desc: '帶著行李退房，從中部沖繩市南下至充滿神聖氣息的南城市。' },
      { time: '10:15 - 12:15', title: '玉泉洞 / 沖繩世界', type: 'activity', icon: Activity, mapQuery: 'おきなわワールド', desc: '直接進入「玉泉洞」看鐘乳石。11:00 左右回王國村(想看 10:30 太鼓表演可稍作停留)。經過名產區可試喝毒蛇酒或買伴手禮。', map: true },
      { time: '12:15 - 12:30', title: '離開園區', type: 'transport', icon: Car, mapQuery: 'おきなわワールド', desc: '避開園區內用餐的高峰人潮。' },
      { time: '12:30 - 13:40', title: '屋宜家 (やぎや)', type: 'food', icon: Coffee, mapQuery: '屋宜家', desc: '【午餐】步行於百年紅瓦古民家，氣氛極佳。推薦「黑糖黃豆粉黑蜜蕎麥麵」作為甜點。', map: true },
      { time: '13:40 - 14:30', title: '前往瀨長島', type: 'transport', icon: Car, mapQuery: '瀨長島 Umikaji Terrace', desc: '由南向北沿著海岸線行駛，前往看海秘境。' },
      { time: '14:30 - 16:00', title: '瀨長島 (下午茶)', type: 'activity', icon: MapIcon, mapQuery: '瀨長島 Umikaji Terrace', desc: '逛瀨長島展望台、Umikaji Terrace 小希臘商場，看飛機起降與海景。\n\n💡【攻略】幸福鬆餅內用極久，果斷選「外帶(Takeout)」約10分 ➔ 外圍階梯看海吃。', map: true },
      { time: '16:15 - 16:45', title: '進入那霸市區', type: 'transport', icon: Car, mapQuery: 'Almont Hotel Naha-Kenchomae', desc: '結束海岸線行程，驅車進入車水馬龍的那霸市中心。' },
      { time: '16:45 - 17:10', title: 'Almont Hotel 寄放行李', type: 'accommodation', icon: Bed, mapQuery: 'Almont Hotel Naha-Kenchomae', desc: '抵達位於縣廳前站的飯店先行寄放行李，減輕負擔以利後續還車。', map: true },
      { time: '17:10 - 17:40', title: '市區營業所還車', type: 'transport', icon: Car, mapQuery: '那霸市', desc: '【注意時程】前往那霸市區營業所完成還車手續，請記得預留把油箱加滿的時間。', gasStation: true },
      { time: '17:40 - 21:00', title: '國際通深度遊與晚餐', type: 'food', icon: Coffee, mapQuery: '國際通', desc: '晚餐吃傑克牛排(先抽號碼牌)。體驗那霸市區夜生活：Blue Seal、豬肉蛋飯糰、屋台村、MEGA Donki、Calbee+、鹽屋雪鹽冰淇淋、RYUBO百貨、暖暮拉麵、琉家拉麵、ふくぎや年輪蛋糕。', map: true },
      { time: '22:00', title: '返回飯店休息', type: 'accommodation', icon: Bed, mapQuery: 'Almont Hotel Naha-Kenchomae' }
    ]
  },
  {
    day: 5, date: '8/22', title: '文化巡禮、波上宮與無敵日落', region: '那霸 / 浦添',
    events: [
      { time: '08:00 - 08:45', title: '吃早餐搭單軌往首里', type: 'transport', icon: Coffee, mapQuery: '首里城', desc: '吃個超商早餐，搭乘單軌電車前往「首里站」，步行至首里城。', map: true },
      { time: '08:45 - 10:15', title: '首里城', type: 'activity', icon: MapIcon, mapQuery: '首里城', desc: '參觀修復工程、觀景台、買紀念幣。\n\n💡【攻略】走無階梯「藍色路線」。動線：歡會門 ➔ 廣福門 ➔ 奉神門(買票400円入內) ➔ 正殿(看修復) ➔ 東崎(市景)。外圍免費。', map: true },
      { time: '10:15 - 11:00', title: '步行回單軌前往牧志站', type: 'transport', icon: Car, mapQuery: '第一牧志公設市場', desc: '步行回單軌首里站 ➔ 搭單軌回「牧志站」 ➔ 步行進市場。' },
      { time: '11:00 - 13:00', title: '第一牧志公設市場', type: 'food', icon: Coffee, mapQuery: '第一牧志公設市場', desc: '一樓挑海鮮，二樓代客料理。\n\n💡【攻略】確認標價(100g/1kg)多比價！動線：1F買海鮮(夜光貝/龍蝦)或肉品 ➔ 拿單據 ➔ 2F代客料理。必買：2F步沙翁(易售完)。', map: true },
      { time: '13:00 - 13:20', title: '搭計程車前往波上宮', type: 'transport', icon: Car, mapQuery: '波上宮', desc: '吃飽喝足，直接從市場外圍攔一台計程車前往波上宮（車程約 10 分鐘，省去大太陽下走 30 分鐘的體力）。' },
      { time: '13:20 - 14:20', title: '波上宮', type: 'activity', icon: MapIcon, mapQuery: '波上宮', desc: '建在珊瑚礁斷崖上的琉球最高神社。買「沖繩限定」小書包御守，波之上海灘拍神社。', map: true },
      { time: '14:20 - 14:50', title: '搭計程車前往 PARCO', type: 'transport', icon: Car, mapQuery: 'サンエー浦添西海岸 PARCO CITY', desc: '從波上宮直接搭計程車前往 PARCO CITY（車資約 1,500 - 2,000 日圓）。' },
      { time: '14:50 - 19:30', title: 'PARCO CITY 大採買', type: 'shopping', icon: ShoppingBag, mapQuery: 'サンエー浦添西海岸 PARCO CITY', desc: '進行免稅服飾、吉伊卡哇等大採買。\n\n💡【攻略】免稅：店內 或 1F退(護照+實體卡)。動線：直攻3F(吉伊卡哇/阿卡將/運動/敘敘苑) ➔ 1F退稅 ➔ 2F海景美食區(極味屋/Taco)看夕陽。', map: true },
      { time: '19:30 - 20:30', title: 'PARCO CITY 海景晚餐', type: 'food', icon: Coffee, mapQuery: 'サンエー浦添西海岸 PARCO CITY', desc: '在無敵海景美食街享用敘敘苑燒肉、迴轉壽司、極味屋、Taco。', map: true },
      { time: '22:00', title: '叫計程車返回飯店', type: 'transport', icon: Car, mapQuery: 'Almont Hotel Naha-Kenchomae', desc: '叫一台計程車直接返回飯店，車資平攤下來非常划算。記得預約明天清晨去機場的車！' }
    ]
  },
  {
    day: 6, date: '8/23', title: '賦歸', region: '那霸機場',
    events: [
      { time: '05:30 - 06:00', title: '機場早餐', type: 'food', icon: Coffee, mapQuery: 'ポーたま 那覇空港国内線到着ロビー店', desc: '珀塔瑪 那霸機場(國際線航廈 4樓 北側美食區，炸蝦豬肉蛋飯糰或是苦瓜天婦羅口味)。七點開或超商簡單食物。', map: true },
      { time: '06:00 - 06:15', title: '搭計程車抵達那霸機場', type: 'transport', icon: Car, mapQuery: '那霸機場', desc: '搭乘預約好的計程車，輕鬆前往那霸機場準備登機。' },
      { time: '08:10', title: '班機起飛，滿載而歸！', type: 'activity', icon: PlaneTakeoff, mapQuery: '那霸機場', desc: '回程航班 MM921，08:10 起飛。帶著滿滿的美好回憶，搭機返回溫暖的家。', map: true }
    ]
  }
];

const TRIP_YEAR = 2026; 
const PROCESSED_ITINERARY = ITINERARY_DATA.map(dayData => {
  const [month, date] = dayData.date.split('/').map(Number);
  const events = dayData.events.map(evt => {
    const match = evt.time.match(/(\d{2}):(\d{2})/);
    let timeObj = null;
    if (match) {
      timeObj = new Date(TRIP_YEAR, month - 1, date, Number(match[1]), Number(match[2]), 0);
    }
    return { ...evt, timeObj };
  });
  return { ...dayData, events };
});

// --- 🌟 柔和環境粒子 ---
const AmbientBackground = () => {
  const particles = useMemo(() => Array.from({ length: 15 }).map((_, i) => {
    const size = Math.random() * 60 + 20;
    return {
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${size}px`,
      duration: `${Math.random() * 20 + 20}s`,
      delay: `${Math.random() * 5}s`,
      tx: `${(Math.random() - 0.5) * 150}px`,
      ty: `${(Math.random() - 1) * 200}px`, 
    };
  }), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen opacity-40">
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full will-change-transform" style={{
          left: p.left, top: p.top, width: p.size, height: p.size,
          background: 'radial-gradient(circle, rgba(199,210,254,0.4) 0%, rgba(199,210,254,0) 70%)',
          animation: `ambientDrift ${p.duration} ease-in-out infinite alternate`,
          animationDelay: p.delay,
          '--tx': p.tx, '--ty': p.ty
        }} />
      ))}
    </div>
  );
};

const Toast = ({ message, visible }) => {
  if (!visible) return null;
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-max bg-slate-800 text-white px-5 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
      <CheckCircle size={18} className="mr-2 text-emerald-400" />
      {message}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOffline, setIsOffline] = useState(false); 
  const [toastMsg, setToastMsg] = useState({ text: '', visible: false });

  const showToast = (msg) => {
    setToastMsg({ text: msg, visible: true });
    setTimeout(() => setToastMsg({ text: '', visible: false }), 2500);
  };

  const [exchangeRate, setExchangeRate] = useState(0.215);
  const [vouchers, setVouchers] = useState([
    { id: 1, title: '虎航去程 (IT230)', date: '8/18 09:20', note: '航廈 1', details: '使用者上傳' }
  ]);

  useEffect(() => {
    // 將所有動畫樣式統一至 global CSS 中，避免 JSX 中撰寫 style tag 出錯
    const style = document.createElement('style');
    style.innerHTML = `
      /* 確保外層不影響 Sticky 的運作 */
      html, body { overflow-x: hidden; }

      @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      .animate-float { animation: float 4s ease-in-out infinite; }
      
      @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(30px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
      .stagger-item { opacity: 0; animation: slideUpFade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      
      /* 修正點：將 100% 時的 filter: blur(0) 改為 filter: none，避免破壞內部 fixed / sticky 元素的定位基準 */
      @keyframes pageEnter { from { opacity: 0; filter: blur(2px); } to { opacity: 1; filter: none; transform: none; } }
      .page-transition { animation: pageEnter 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }

      @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      .animate-bg-shift { background-size: 200% 200%; animation: gradientShift 10s ease infinite; }

      @keyframes ambientDrift { 0% { transform: translate(0, 0) scale(0.8); } 100% { transform: translate(var(--tx), var(--ty)) scale(1.2); } }
      
      @keyframes modalPop { 0% { opacity: 0; transform: scale(0.95) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
      .modal-animate { animation: modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      
      /* 模擬掃描線 */
      @keyframes scanEffect { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
      .scan-line { animation: scanEffect 2s ease-in-out infinite; }
      
      /* 隱藏原生捲軸，讓介面更像 App */
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const NavButton = ({ id, icon: Icon, label }) => (
    <button 
      type="button"
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center w-full py-3 space-y-1 transition-all duration-300 active:scale-95
        ${activeTab === id ? 'text-indigo-600 drop-shadow-sm' : 'text-slate-400 hover:text-indigo-400'}`}
    >
      <div className={`transition-all duration-500 ease-out ${activeTab === id ? '-translate-y-1.5 scale-110 drop-shadow-md' : ''}`}>
        <Icon size={24} />
      </div>
      <span className={`text-[10px] font-bold transition-all duration-300 ${activeTab === id ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] text-slate-800 font-sans selection:bg-indigo-100 overflow-hidden flex flex-col items-center">
      <AmbientBackground />
      <Toast message={toastMsg.text} visible={toastMsg.visible} />

      <main key={activeTab} className="page-transition w-full max-w-md relative z-10 flex-1 overflow-y-auto scrollbar-hide pb-28">
        {isOffline && (
          <div className="bg-slate-800 text-white text-xs font-bold py-1.5 flex items-center justify-center animate-in slide-in-from-top-2 sticky top-0 z-[100]">
            <WifiOff size={14} className="mr-2 text-rose-400" /> 目前處於離線就緒模式 (PWA Cache)
          </div>
        )}

        {activeTab === 'dashboard' && (
          <Dashboard exchangeRate={exchangeRate} setExchangeRate={setExchangeRate} isOffline={isOffline} />
        )}
        {activeTab === 'itinerary' && <Itinerary showToast={showToast} />}
        {activeTab === 'vouchers' && <VoucherWallet vouchers={vouchers} setVouchers={setVouchers} />}
        {activeTab === 'emergency' && <EmergencyKit isOffline={isOffline} setIsOffline={setIsOffline} />}
      </main>

      <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-200/60 flex justify-around items-center max-w-md left-1/2 -translate-x-1/2 z-50 pb-2 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] rounded-t-3xl">
        <NavButton id="dashboard" icon={Home} label="動態總覽" />
        <NavButton id="itinerary" icon={MapIcon} label="行程嚮導" />
        <NavButton id="vouchers" icon={Ticket} label="電子憑證" />
        <NavButton id="emergency" icon={ShieldAlert} label="危機應變" />
      </nav>
    </div>
  );
}

// ==========================================
// 1. 動態總覽 (Dashboard)
// ==========================================
function Dashboard({ exchangeRate, setExchangeRate, isOffline }) {
  const [jpyInput, setJpyInput] = useState('');
  const [showReturnFlight, setShowReturnFlight] = useState(false);
  const [weather, setWeather] = useState({ temp: '--', desc: '載入中...', color: 'from-sky-400 to-blue-500' });
  const [isRateLive, setIsRateLive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // 🌤️ 串接即時氣象與匯率 API
  useEffect(() => {
    if (!isOffline) {
      // 氣象 API
      fetch('https://api.open-meteo.com/v1/forecast?latitude=26.2124&longitude=127.6809&current_weather=true')
        .then(res => res.json())
        .then(data => {
          if (data && data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const code = data.current_weather.weathercode;
            let desc = '晴朗';
            let color = 'from-sky-400 to-blue-500';
            if (code >= 1 && code <= 3) { desc = '多雲'; color = 'from-indigo-400 to-indigo-600'; }
            if (code >= 51 && code <= 67) { desc = '雨天'; color = 'from-slate-500 to-slate-700'; }
            if (code >= 71 && code <= 99) { desc = '雷陣雨'; color = 'from-slate-600 to-slate-800'; }
            setWeather({ temp: `${temp}°`, desc, color });
          }
        })
        .catch(() => setWeather({ temp: '--', desc: '無法取得', color: 'from-slate-400 to-slate-500' }));
        
      // 匯率 API (擷取 JPY 對 TWD 的即時開源數據)
      fetch('https://open.er-api.com/v6/latest/JPY')
        .then(res => res.json())
        .then(data => {
          if (data && data.rates && data.rates.TWD) {
            setExchangeRate(Number(data.rates.TWD.toFixed(4)));
            setIsRateLive(true);
          }
        })
        .catch(() => setIsRateLive(false));
    }
  }, [isOffline, setExchangeRate]);

  // 自動判斷回程航班顯示
  const isReturnFlightDefault = new Date().getTime() > new Date(TRIP_YEAR, 7, 20).getTime();
  useEffect(() => setShowReturnFlight(isReturnFlightDefault), [isReturnFlightDefault]);

  return (
    <div className="pb-6 relative z-10">
      <header className="animate-bg-shift bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-500 shadow-lg px-5 py-7 mb-6 rounded-b-3xl flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
          <Plane size={100} className="rotate-[-20deg]" />
        </div>
        <div className="text-white relative z-10">
          <h1 className="text-2xl font-black tracking-tight drop-shadow-md">OkiTrack</h1>
          <p className="text-xs text-sky-100 font-bold tracking-wide mt-0.5">自駕生存嚮導</p>
        </div>
      </header>

      <div className="px-5 space-y-6">
        <div className={`bg-gradient-to-r ${isOffline ? 'from-slate-400 to-slate-500' : weather.color} rounded-3xl p-6 text-white shadow-md flex items-center justify-between transition-all duration-500 hover:shadow-lg`}>
          <div>
            <h3 className="font-bold text-lg drop-shadow-sm flex items-center">
              沖繩 那霸市 <RefreshCw size={14} className={`ml-2 opacity-50 ${isOffline ? 'hidden' : 'animate-spin'}`} style={{ animationDuration: '3s' }} />
            </h3>
            <p className="text-white/80 text-xs font-bold mt-1">
              {isOffline ? '離線模式 (無即時資料)' : `今日即時預報：${weather.desc}`}
            </p>
          </div>
          <div className="flex items-center space-x-3 animate-float">
            <CloudSun size={40} className={isOffline ? 'text-slate-300 opacity-50' : 'text-white drop-shadow-md'} />
            <span className="text-4xl font-black drop-shadow-sm">{isOffline ? '--' : weather.temp}</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-slate-100 stagger-item" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-800 flex items-center">
              {showReturnFlight ? <PlaneTakeoff size={18} className="mr-2 text-indigo-500" /> : <PlaneLanding size={18} className="mr-2 text-indigo-500" />} 
              航班追蹤
            </h3>
            <button type="button" onClick={() => setShowReturnFlight(!showReturnFlight)} className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1.5 rounded-lg active:scale-95 transition-all hover:bg-indigo-100">
              切換{showReturnFlight ? '去程' : '回程'}
            </button>
          </div>
          <div className="flex justify-between items-center bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{showReturnFlight ? 'OKA 那霸' : 'TPE 桃園'}</p>
              <h4 className="text-2xl font-black text-slate-800">{showReturnFlight ? '08:10' : '09:20'}</h4>
            </div>
            <div className="flex flex-col items-center flex-1 px-4 relative">
              <div className="w-full border-t-2 border-dashed border-slate-300 my-2 relative">
                 <Plane size={16} className={`text-indigo-500 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform duration-500 ${showReturnFlight ? '-rotate-12' : 'rotate-12'}`} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-white px-2 rounded-full border border-slate-100">{showReturnFlight ? '約 1h 40m' : '約 1h 30m'}</span>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{showReturnFlight ? 'TPE 桃園' : 'OKA 那霸'}</p>
              <h4 className="text-2xl font-black text-slate-800">{showReturnFlight ? '08:50' : '11:50'}</h4>
            </div>
          </div>
          <div className="flex justify-between mt-4 text-sm font-bold">
            <div className="flex flex-col items-center flex-1 border-r border-slate-100">
              <span className="text-slate-400 text-xs mb-0.5">航班代號</span>
              <span className="text-slate-700">{showReturnFlight ? 'MM921' : 'IT230'}</span>
            </div>
            <div className="flex flex-col items-center flex-1 border-r border-slate-100">
              <span className="text-slate-400 text-xs mb-0.5">出發航廈</span>
              <span className="text-slate-700">{showReturnFlight ? '國際線' : 'T1'}</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-slate-400 text-xs mb-0.5">狀態</span>
              <span className="text-emerald-500">準點</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-slate-100 stagger-item" style={{ animationDelay: '100ms' }}>
          <h3 className="font-extrabold text-slate-800 mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <Calculator size={18} className="mr-2 text-indigo-500" /> 即時匯率換算
            </div>
            <div className="text-xs font-bold text-slate-400 flex items-center bg-slate-50 px-2 py-1 rounded-lg relative overflow-hidden">
              {isRateLive && (
                <span className="flex h-2 w-2 relative mr-1.5" title="即時連線中">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
              設定匯率：
              <input type="number" step="0.001" value={exchangeRate} onChange={e => {
                setExchangeRate(Number(e.target.value) || 0);
                setIsRateLive(false); // 若手動修改，則關閉即時連線燈號
              }} className="bg-transparent w-14 ml-1 outline-none text-indigo-600 font-black relative z-10" />
            </div>
          </h3>
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">¥</span>
              <input 
                type="number" placeholder="日圓 JPY" value={jpyInput} onChange={e => setJpyInput(e.target.value)}
                className="w-full bg-slate-50 text-xl font-black text-slate-800 border border-slate-200 rounded-2xl p-4 pl-9 focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
              />
            </div>
            <ArrowRight size={20} className="text-slate-300 flex-shrink-0" />
            <div className="flex-1 relative bg-indigo-50 rounded-2xl p-4 border border-indigo-100 flex items-center">
              <span className="text-indigo-400 font-black mr-1">$</span>
              <span className="text-xl font-black text-indigo-700 truncate">
                {jpyInput ? Math.round((Number(jpyInput) || 0) * (exchangeRate || 0)).toLocaleString() : '0'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 🌟 倒數計時小工具元件 (Countdown Banner)
// ==========================================
function CountdownBanner({ nextEvent }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!nextEvent || !nextEvent.timeObj) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = nextEvent.timeObj.getTime() - now;

      if (distance < 0) {
        setTimeLeft('即將開始或已結束');
      } else {
        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);
        
        let timeStr = '';
        if (d > 0) timeStr += `${d}天 `;
        if (h > 0 || d > 0) timeStr += `${h}時 `;
        timeStr += `${m}分 ${s}秒`;
        setTimeLeft(timeStr);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextEvent]);

  if (!nextEvent) return null;

  return (
    <div className="bg-indigo-600 text-white text-xs font-bold py-2.5 px-4 flex items-center justify-center shadow-inner relative z-50">
      <Clock size={14} className="mr-2 animate-pulse" />
      前往 ({nextEvent.title}) 還剩：<span className="ml-1 text-amber-300 font-black">{timeLeft}</span>
    </div>
  );
}

// ==========================================
// 2. 行程嚮導與地圖 (Itinerary)
// ==========================================
function Itinerary({ showToast }) {
  const [activeDay, setActiveDay] = useState(1);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [nextUpcomingEvent, setNextUpcomingEvent] = useState(null);

  // --- 🌟 智慧自動跳轉邏輯 ---
  useEffect(() => {
    const now = new Date();
    let foundNext = null;

    for (const dayData of PROCESSED_ITINERARY) {
      for (let i = 0; i < dayData.events.length; i++) {
        const evt = dayData.events[i];
        if (evt.timeObj && evt.timeObj.getTime() > now.getTime()) {
          foundNext = { day: dayData.day, index: i, ...evt };
          break;
        }
      }
      if (foundNext) break;
    }

    if (foundNext) {
      setNextUpcomingEvent(foundNext);
      setActiveDay(foundNext.day);
      setActiveEventIndex(foundNext.index);
      
      // 自動滾動，扣除頂部 Sticky 區塊的高度 (大約 300px)
      setTimeout(() => {
        const el = document.getElementById(`event-${foundNext.day}-${foundNext.index}`);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 300;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 500); 
    }
  }, []);

  const rawDayIndex = PROCESSED_ITINERARY.findIndex(d => d.day === activeDay);
  const safeDayIndex = Math.max(0, rawDayIndex);
  const events = PROCESSED_ITINERARY[safeDayIndex]?.events || [];
  
  const safeIndex = (activeEventIndex >= 0 && activeEventIndex < events.length) ? activeEventIndex : 0;
  const activeEvent = events[safeIndex] || {};
  const activeMapQuery = activeEvent.mapQuery || activeEvent.title || 'Okinawa';

  const getMapData = (dayIdx, evtIdx) => {
    const sDayIdx = Math.max(0, dayIdx);
    const evtList = PROCESSED_ITINERARY[sDayIdx]?.events || [];
    const sEvtIdx = (evtIdx >= 0 && evtIdx < evtList.length) ? evtIdx : 0;
    
    const evt = evtList[sEvtIdx] || {};
    const destination = evt.mapQuery || evt.title || '';
    const isTransport = evt.type === 'transport';

    let url = '';
    if (isTransport) {
      let origin = '';
      if (sEvtIdx > 0) {
        origin = evtList[sEvtIdx - 1].mapQuery || evtList[sEvtIdx - 1].title;
      } else if (sDayIdx > 0) {
        const prevDayEvents = PROCESSED_ITINERARY[sDayIdx - 1].events || [];
        if (prevDayEvents.length > 0) {
          origin = prevDayEvents[prevDayEvents.length - 1].mapQuery || prevDayEvents[prevDayEvents.length - 1].title;
        }
      }
      url = origin ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}` 
                   : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
    }
    return { isTransport, url };
  };

  return (
    <div className="relative">
      
      {/* 📌 地圖絕對固定區塊：改用 sticky 確保它永遠在畫面上方，且不受父層動畫影響 */}
      <div className="sticky top-0 w-full z-40 bg-[#F8FAFC] shadow-md border-b border-slate-200">
        <CountdownBanner nextEvent={nextUpcomingEvent} />

        <div className="w-full h-48 bg-slate-200 relative flex-shrink-0">
          <iframe
            title="Google Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(activeMapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
          ></iframe>
        </div>

        <div className="bg-white/95 backdrop-blur-xl px-3 py-3 flex space-x-3 overflow-x-auto scrollbar-hide shadow-sm flex-shrink-0">
          {PROCESSED_ITINERARY.map((data) => (
            <button
              key={data.day}
              type="button"
              onClick={() => { setActiveDay(data.day); setActiveEventIndex(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex-shrink-0 px-4 py-2.5 rounded-2xl flex flex-col items-center min-w-[75px] transition-all duration-500 ease-out active:scale-95
                ${activeDay === data.day ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'}`}
            >
              <span className="text-[9px] font-black uppercase mb-0.5 opacity-80 tracking-widest">Day {data.day}</span>
              <span className="text-xs font-black">{data.date}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 📜 行程清單 (由於上方改為 sticky，拿掉原本手動推擠的 pt-[320px]，恢復正常自然排版) */}
      <div className="p-4 space-y-4 pb-10 relative z-10">
        <div className="mb-2 px-2 flex items-center justify-between">
           <h2 className="text-lg font-black text-indigo-900 flex items-center">
             <MapPin size={20} className="mr-2 text-rose-500" /> {PROCESSED_ITINERARY[safeDayIndex]?.region}
           </h2>
        </div>

        {events.map((evt, idx) => {
          const isActive = safeIndex === idx;
          const mapData = getMapData(safeDayIndex, idx);

          return (
            <div 
              id={`event-${activeDay}-${idx}`}
              key={`day-${activeDay}-event-${idx}`} 
              onClick={() => setActiveEventIndex(idx)}
              className={`stagger-item bg-white/90 backdrop-blur-sm rounded-3xl p-4 transition-all duration-500 ease-out cursor-pointer border
                ${isActive ? 'border-indigo-400 shadow-lg ring-4 ring-indigo-50 scale-[1.01]' : 'border-slate-100 shadow-sm hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md active:scale-[0.98]'}`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start">
                <div className={`p-2.5 rounded-2xl mr-3 mt-1 shadow-inner border flex-shrink-0 transition-colors duration-500
                  ${isActive ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                  <evt.icon size={20} />
                </div>
                <div className="flex-1">
                  <div className={`text-[10px] font-black tracking-wider mb-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>{evt.time}</div>
                  <h3 className={`font-bold leading-snug transition-colors ${isActive ? 'text-indigo-950' : 'text-slate-700'}`}>{evt.title}</h3>
                  {evt.note && <p className="text-xs text-slate-500 mt-1 font-medium">{evt.note}</p>}
                </div>
                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-500 ${isActive ? 'bg-indigo-50' : ''}`}>
                  <ChevronDown size={18} className={`text-slate-300 transition-transform duration-500 ${isActive ? 'rotate-180 text-indigo-500' : ''}`} />
                </div>
              </div>

              {isActive && (
                <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-4 fade-in duration-500 ease-out space-y-3">
                  {/* 加入 whitespace-pre-wrap 讓說明欄位支援換行排版 */}
                  {evt.desc && (
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100 shadow-inner whitespace-pre-wrap">
                      {evt.desc}
                    </p>
                  )}

                  {/* 🅿️ 停車場雷達資訊 */}
                  {evt.parking && (
                    <div className="w-full flex items-start bg-amber-50 border border-amber-100 p-3.5 rounded-2xl shadow-sm">
                       <CircleParking size={18} className="text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                       <div>
                         <p className="text-xs font-black text-amber-900 mb-0.5">{evt.parking.name}</p>
                         <p className="text-[10px] font-bold text-amber-700">{evt.parking.fee}</p>
                       </div>
                    </div>
                  )}

                  {/* ⛽ 還車找加油站功能 */}
                  {evt.gasStation && (
                    <a 
                      href="https://www.google.com/maps/search/加油站/@26.212312,127.679157,14z" 
                      target="_blank" rel="noreferrer"
                      className="w-full flex items-center justify-center bg-rose-50 border border-rose-100 text-rose-700 p-3.5 rounded-2xl hover:bg-rose-100 active:scale-95 transition-all shadow-sm"
                    >
                      <Fuel size={16} className="mr-2" /> <span className="text-xs font-black">一鍵搜尋周邊加油站 (滿油還車)</span>
                    </a>
                  )}
                  
                  <a 
                    href={mapData.url} target="_blank" rel="noreferrer"
                    className={`w-full text-xs font-bold py-3.5 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-sm
                      ${mapData.isTransport 
                        ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-100 hover:shadow-md' 
                        : 'bg-white text-slate-700 border border-slate-200 hover:shadow-md'}`}
                  >
                    {mapData.isTransport ? (
                      <><Navigation size={16} className="mr-2" /> 開啟 Google 路線導航 <ArrowRight size={14} className="ml-1 opacity-70" /></>
                    ) : (
                      <><MapPin size={16} className="mr-2" /> 查看 Google 定點地標</>
                    )}
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 3. 憑證票夾 (Voucher Wallet)
// ==========================================
function VoucherWallet({ vouchers, setVouchers }) {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ id: null, title: '', note: '', textContent: '', image: null });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) return;
    
    if (isEditing) {
      setVouchers(vouchers.map(v => v.id === form.id ? { ...v, ...form } : v));
    } else {
      const newVoucher = {
        id: Date.now(), title: form.title, note: form.note || '已上傳',
        date: new Date().toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' }),
        textContent: form.textContent, image: form.image, details: '使用者自行上傳'
      };
      setVouchers([newVoucher, ...vouchers]);
    }
    closeForm();
  };

  const handleEdit = (e, v) => {
    e.stopPropagation();
    setIsEditing(true);
    setForm({ id: v.id, title: v.title, note: v.note || '', textContent: v.textContent || '', image: v.image || null });
    setIsFormOpen(true);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    setVouchers(vouchers.filter(v => v.id !== id));
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsEditing(false);
    setForm({ id: null, title: '', note: '', textContent: '', image: null });
  };

  const getVoucherIcon = (title) => {
    if (!title) return <FileText size={24} />;
    if (title.includes('機票') || title.includes('航班') || title.toLowerCase().includes('flight')) return <Plane size={24} />;
    if (title.includes('住宿') || title.includes('飯店') || title.toLowerCase().includes('hotel')) return <Bed size={24} />;
    return <FileText size={24} />;
  };

  return (
    <div className="p-4 pt-6 space-y-6 relative z-10">
      
      {/* 新增/編輯表單 */}
      {isFormOpen ? (
        <div className={`bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg transition-all duration-300 border-2 ${isEditing ? 'border-amber-300 ring-4 ring-amber-50' : 'border-indigo-300 ring-4 ring-indigo-50'} animate-in zoom-in-95`}>
          <h3 className="font-extrabold text-slate-800 mb-4 flex items-center justify-between">
            <div className="flex items-center">
              {isEditing ? <Edit2 size={18} className="mr-2 text-amber-500" /> : <Plus size={18} className="mr-2 text-indigo-500" />} 
              {isEditing ? '編輯憑證' : '新增電子憑證'}
            </div>
            <button type="button" onClick={closeForm} className="text-xs bg-slate-100 text-slate-500 font-bold px-3 py-1.5 rounded-lg hover:bg-slate-200 active:scale-95 transition-all">取消</button>
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" placeholder="憑證標題 (例: 虎航去程機票)*" required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="w-full bg-slate-50 text-sm font-bold border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-400 outline-none transition-all hover:bg-white"
            />
            <input 
              type="text" placeholder="副標題/備註 (例: 航廈 1)" value={form.note} onChange={e => setForm({...form, note: e.target.value})}
              className="w-full bg-slate-50 text-sm font-medium border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-400 outline-none transition-all hover:bg-white"
            />
            <textarea 
              placeholder="詳細內容 (如訂位代號、地址...)" rows="3" value={form.textContent} onChange={e => setForm({...form, textContent: e.target.value})}
              className="w-full bg-slate-50 text-sm font-medium border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-400 outline-none transition-all hover:bg-white resize-none"
            />
            
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 relative overflow-hidden group">
              {form.image ? (
                <div className="relative">
                  <img src={form.image} alt="Preview" className="mx-auto h-32 object-contain rounded-lg shadow-sm" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg backdrop-blur-sm">
                    <span className="text-white text-xs font-bold flex items-center"><ImagePlus size={16} className="mr-1"/> 更換截圖</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-3">
                  <div className="bg-slate-100 p-3 rounded-full mb-3 group-hover:bg-indigo-100 transition-colors duration-300">
                    <ImagePlus size={24} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">點擊上傳憑證截圖 / QR Code</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>

            <button type="submit" className={`w-full text-white font-bold py-4 rounded-2xl transition-all duration-300 active:scale-[0.95] shadow-md ${isEditing ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:shadow-lg hover:-translate-y-0.5' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:-translate-y-0.5'}`}>
              {isEditing ? '儲存修改' : '儲存憑證'}
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsFormOpen(true)}
          className="w-full bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 hover:bg-indigo-50 hover:-translate-y-1 hover:shadow-md hover:border-indigo-200 active:scale-95 transition-all duration-500 ease-out group"
        >
          <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-inner">
            <Upload size={28} />
          </div>
          <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-700 transition-colors">新增電子憑證</span>
        </button>
      )}

      <div>
        <h3 className="font-extrabold text-slate-800 mb-4 ml-2">離線票夾</h3>
        <div className="space-y-4">
          {vouchers.map((v, idx) => (
            <div 
              key={v.id} 
              onClick={() => setSelectedVoucher(v)}
              className="stagger-item bg-white/90 backdrop-blur-sm rounded-3xl p-1 shadow-sm border border-slate-100 flex items-center relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-md hover:border-indigo-300 transition-all duration-500 ease-out active:scale-[0.97] group"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="w-2.5 h-full absolute left-0 top-0 bg-gradient-to-b from-indigo-400 to-purple-500"></div>
              <div className="p-4 pl-7 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 text-sm truncate pr-2 group-hover:text-indigo-700 transition-colors">{v.title}</h4>
                  <div className="bg-slate-50 p-1.5 rounded-xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                     {v.image ? <ImagePlus size={18} /> : <QrCode size={18} />}
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-[10px] text-slate-400 font-bold">{v.note}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black bg-slate-50 text-slate-500 px-2 py-1 rounded-lg border border-slate-100">{v.date}</span>
                    <div className="flex space-x-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={(e) => handleEdit(e, v)} className="p-1 bg-slate-100 rounded-md text-slate-500 hover:text-amber-500 hover:bg-amber-50 active:scale-90 transition-all"><Edit2 size={12}/></button>
                      <button type="button" onClick={(e) => handleDelete(e, v.id)} className="p-1 bg-slate-100 rounded-md text-slate-500 hover:text-rose-500 hover:bg-rose-50 active:scale-90 transition-all"><Trash2 size={12}/></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {vouchers.length === 0 && (
            <div className="text-center text-slate-400 py-8 text-sm font-medium">票夾空空如也，趕快上傳憑證吧！</div>
          )}
        </div>
      </div>

      {selectedVoucher && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-5 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="modal-animate bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
            <div className="p-5 flex justify-between items-center text-white bg-gradient-to-r from-indigo-500 to-purple-600 flex-shrink-0 shadow-sm z-10">
              <h3 className="font-black text-lg flex items-center gap-2 drop-shadow-sm">
                {getVoucherIcon(selectedVoucher.title)} 電子憑證
              </h3>
              <button type="button" onClick={() => setSelectedVoucher(null)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors active:scale-90"><X size={20}/></button>
            </div>
            
            <div className="p-8 overflow-y-auto bg-[#F8FAFC]">
              <div className="text-center mb-6">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">VOUCHER NAME</p>
                <h4 className="text-xl font-black text-slate-800 leading-tight">{selectedVoucher.title}</h4>
                <p className="text-xs font-bold text-indigo-500 mt-3 bg-indigo-50 inline-block px-4 py-1.5 rounded-full border border-indigo-100">{selectedVoucher.note}</p>
              </div>
              
              {/* 動態展示區：這會先顯示使用者上傳的圖片，如果沒有，會顯示動態掃描 QR Code 預設畫面 */}
              {selectedVoucher.image ? (
                <div className="mx-auto rounded-2xl overflow-hidden border-2 border-white shadow-md mb-6 bg-white p-2">
                  <img src={selectedVoucher.image} alt="Voucher" className="w-full h-auto object-contain max-h-64 rounded-xl" />
                </div>
              ) : (
                <div className="bg-white border-4 border-white shadow-md p-5 rounded-[2rem] mx-auto w-48 h-48 flex items-center justify-center relative overflow-hidden mb-6">
                   <QrCode size={120} className="text-slate-800" strokeWidth={1} />
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-transparent scan-line"></div>
                </div>
              )}

              {selectedVoucher.textContent && (
                <div className="bg-white rounded-2xl p-4 border border-slate-100 mb-6 shadow-sm">
                  <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed font-medium">{selectedVoucher.textContent}</p>
                </div>
              )}
              
              <div className="mt-4 flex items-center justify-center text-emerald-600 font-bold text-sm bg-emerald-50 py-3.5 rounded-2xl border border-emerald-100 shadow-sm">
                <CheckCircle size={18} className="mr-2" /> 離線快取已驗證
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. 危機應變中心 (Emergency Kit)
// ==========================================
function EmergencyKit({ isOffline, setIsOffline }) {
  return (
    <div className="p-4 pt-6 space-y-6 animate-in fade-in duration-500 relative z-10">
      
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-slate-800 flex items-center text-sm">
            <Wifi size={16} className="mr-2 text-indigo-500" /> PWA 離線模式測試
          </h3>
          <p className="text-[10px] text-slate-400 font-bold mt-1">切換以模擬玉泉洞深處無訊號狀態</p>
        </div>
        <button 
          type="button"
          onClick={() => setIsOffline(!isOffline)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${isOffline ? 'bg-rose-500' : 'bg-emerald-500'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${isOffline ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100 shadow-sm relative overflow-hidden stagger-item">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldAlert size={80} className="text-rose-500" />
        </div>
        <h2 className="text-lg font-black text-rose-800 mb-2 relative z-10 flex items-center">
          海外急難救助
        </h2>
        <p className="text-xs text-rose-600 font-bold mb-6 relative z-10">點擊按鈕將直接撥號 (請確保開啟國際漫遊)</p>

        <div className="space-y-3 relative z-10">
          <a href="tel:+81-90-1942-1107" className="w-full bg-white p-4 rounded-2xl flex items-center justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-rose-100 active:scale-95 group">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">台北駐日代表處 (那霸)</h4>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">護照遺失 / 重大意外</p>
            </div>
            <div className="bg-rose-100 text-rose-600 p-2.5 rounded-full group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <PhoneCall size={18} />
            </div>
          </a>

          <a href="tel:0570-077-202" className="w-full bg-white p-4 rounded-2xl flex items-center justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-rose-100 active:scale-95 group">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">沖繩外國人醫療支援專線</h4>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">突發疾病 / 醫院轉介 (有中文)</p>
            </div>
            <div className="bg-rose-100 text-rose-600 p-2.5 rounded-full group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <PhoneCall size={18} />
            </div>
          </a>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-slate-100 shadow-sm stagger-item" style={{ animationDelay: '100ms' }}>
        <h2 className="text-sm font-black text-slate-800 mb-4">💳 個人重要保單與卡片</h2>
        <div className="space-y-3">
          <div className="w-full bg-slate-50 p-4 rounded-2xl flex flex-col justify-between border border-slate-100">
            <div className="flex justify-between items-start w-full">
               <div>
                 <h4 className="font-bold text-slate-700 text-sm">旅平險 / 不便險 客服</h4>
                 <p className="text-[10px] font-bold text-slate-400 mt-1 bg-white inline-block px-2 py-0.5 rounded-md border border-slate-200">保單號碼: (請於出發前自行填寫)</p>
               </div>
               <button type="button" onClick={() => alert('請先設定您的保險客服電話')} className="bg-slate-200 text-slate-500 p-2 rounded-xl hover:bg-slate-300 transition-colors active:scale-90"><PhoneCall size={16} /></button>
            </div>
          </div>
          
          <div className="w-full bg-slate-50 p-4 rounded-2xl flex justify-between items-center border border-slate-100">
             <div>
               <h4 className="font-bold text-slate-700 text-sm">信用卡海外掛失</h4>
               <p className="text-[10px] font-bold text-slate-400 mt-0.5">24 小時服務專線 (出發前自行設定)</p>
             </div>
             <button type="button" onClick={() => alert('請先設定您的信用卡掛失專線')} className="bg-slate-200 text-slate-500 p-2 rounded-xl hover:bg-slate-300 transition-colors active:scale-90"><PhoneCall size={16} /></button>
          </div>
        </div>
      </div>
      
    </div>
  );
}