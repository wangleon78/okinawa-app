import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Map as MapIcon, Ticket, ShieldAlert,
  Plus, Plane, Car, Coffee, ShoppingBag, Bed, Activity,
  ChevronDown, CloudSun, MapPin, 
  Trash2, X, QrCode, CheckCircle, Upload, Navigation, ArrowRight,
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

// --- 🌟 觸覺漣漪視覺化 (Haptic Ripple Component) ---
const LiquidRippleNode = ({ children, className = '', onClick, ...props }) => {
  const [ripples, setRipples] = useState([]);
  const wrapperRef = useRef(null);

  const handleClick = (e) => {
    const rect = wrapperRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple = { id: Date.now(), x, y, size };
    setRipples((prev) => [...prev, newRipple]);

    if (navigator.vibrate) navigator.vibrate(10);
    if (onClick) onClick(e);
  };

  const handleAnimationEnd = (id) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div 
      ref={wrapperRef} 
      onClick={handleClick} 
      className={`relative overflow-hidden ${className} tension-morph`} 
      {...props}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          onAnimationEnd={() => handleAnimationEnd(r.id)}
          className="absolute rounded-full bg-white/40 mix-blend-overlay pointer-events-none animate-ripple"
          style={{ width: r.size, height: r.size, left: r.x, top: r.y }}
        />
      ))}
    </div>
  );
};

// --- 🌟 全息環境粒子背景 (調降透明度以凸顯前景字體) ---
const AmbientBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen opacity-50 bg-[#E8EEF5]">
    <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-indigo-300/40 to-blue-200/40 blur-[120px] animate-pulse mix-blend-multiply" style={{animationDuration: '10s'}} />
    <div className="absolute bottom-[-15%] right-[-15%] w-[80%] h-[80%] rounded-full bg-gradient-to-tl from-cyan-300/40 to-emerald-200/30 blur-[140px] animate-pulse mix-blend-multiply" style={{animationDuration: '14s', animationDelay: '2s'}} />
    <div className="absolute top-[30%] left-[30%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-purple-200/40 to-pink-200/30 blur-[100px] animate-pulse mix-blend-multiply" style={{animationDuration: '12s', animationDelay: '4s'}} />
  </div>
);

// --- 🌟 全域 App 進入點 ---
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
    const style = document.createElement('style');
    style.innerHTML = `
      html, body { 
        overflow-x: hidden; 
        scroll-behavior: smooth; 
        overscroll-behavior-y: none; 
        background: #E8EEF5;
      }
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

      /* 加厚液態玻璃基底，提升文字對比 */
      .liquid-panel {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.6) 100%);
        backdrop-filter: blur(28px) saturate(200%);
        -webkit-backdrop-filter: blur(28px) saturate(200%);
        border: 1px solid rgba(255, 255, 255, 0.9);
        border-radius: 2.5rem; 
        box-shadow: 
          inset 0px 8px 16px -4px rgba(255, 255, 255, 1),
          inset 0px -6px 12px -4px rgba(0, 0, 0, 0.02),
          0 12px 32px rgba(31, 38, 135, 0.08);
      }

      .chromatic-edge { position: relative; }
      .chromatic-edge::before {
        content: ''; position: absolute; inset: -1px; border-radius: inherit; z-index: -1;
        background: linear-gradient(135deg, rgba(255,0,80,0.1) 0%, rgba(255,255,255,0) 50%, rgba(0,200,255,0.1) 100%);
        box-shadow: -2px 0 6px rgba(255, 0, 80, 0.05), 2px 0 6px rgba(0, 200, 255, 0.05);
        pointer-events: none;
      }

      .tension-morph {
        transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.6s ease, border-radius 0.6s ease;
        transform-origin: center;
      }
      .tension-morph:active {
        transform: scale(0.94);
        border-radius: 3rem; 
        box-shadow: inset 0px 4px 8px rgba(255, 255, 255, 1), 0 4px 12px rgba(31, 38, 135, 0.03); 
      }

      .subsurface-glow {
        box-shadow: 
          inset 0 0 20px rgba(99, 102, 241, 0.2), 
          inset 0 8px 16px rgba(255, 255, 255, 1),
          0 16px 32px rgba(99, 102, 241, 0.15) !important;
        background: rgba(255, 255, 255, 0.9) !important;
        border-color: rgba(99, 102, 241, 0.3) !important;
      }

      .holo-sheen { position: relative; overflow: hidden; }
      .holo-sheen::after {
        content: ''; position: absolute; inset: -100%;
        background: linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.4) 40%, rgba(255,230,255,0.2) 45%, transparent 60%);
        background-size: 200% 200%;
        animation: holoReflect 5s infinite linear;
        pointer-events: none; mix-blend-mode: overlay;
      }
      @keyframes holoReflect { 0% { transform: translateX(-50%) translateY(-50%) rotate(0deg); } 100% { transform: translateX(50%) translateY(50%) rotate(360deg); } }

      @keyframes bubbleEnter {
        0% { opacity: 0; filter: blur(10px); transform: scale(0.8) translateY(20px); }
        60% { transform: scale(1.02) translateY(-2px); filter: blur(0px); }
        100% { opacity: 1; filter: blur(0px); transform: scale(1) translateY(0); }
      }
      .bubble-element { animation: bubbleEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

      .gradient-frosted {
        background: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.6));
        backdrop-filter: blur(30px) saturate(200%);
        -webkit-backdrop-filter: blur(30px) saturate(200%);
        -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
        mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
      }
      
      .nav-frosted {
        background: linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0.7));
        backdrop-filter: blur(40px) saturate(250%);
        -webkit-backdrop-filter: blur(40px) saturate(250%);
        border-top: 1px solid rgba(255, 255, 255, 1);
      }

      @keyframes rippleEffect {
        0% { transform: scale(0); opacity: 0.8; }
        100% { transform: scale(3); opacity: 0; }
      }
      .animate-ripple { animation: rippleEffect 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const NavButton = ({ id, icon: Icon, label }) => {
    const isActive = activeTab === id;
    return (
      <LiquidRippleNode 
        onClick={() => setActiveTab(id)}
        className="relative flex flex-col items-center justify-center w-full py-4 space-y-1 group cursor-pointer"
      >
        {isActive && (
          <div className="absolute inset-0 bg-indigo-50/80 rounded-[2.5rem] bubble-element -z-10 shadow-[inset_0_4px_10px_rgba(255,255,255,1)] border border-indigo-100"></div>
        )}
        <div className={`transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${isActive ? '-translate-y-2 scale-110 drop-shadow-lg text-indigo-700' : 'text-slate-400 group-hover:text-indigo-400'}`}>
          <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        {/* 加深並微調放大導航列文字 */}
        <span className={`text-[11px] font-extrabold transition-all duration-300 ${isActive ? 'opacity-100 text-indigo-700' : 'opacity-80 text-slate-500'}`}>{label}</span>
      </LiquidRippleNode>
    );
  };

  return (
    <div className="fixed inset-0 text-slate-800 font-sans selection:bg-indigo-100 overflow-hidden flex flex-col items-center">
      <AmbientBackground />
      {toastMsg.visible && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-max liquid-panel chromatic-edge px-5 py-3 text-sm font-bold flex items-center bubble-element text-indigo-900 border-white shadow-xl">
          <CheckCircle size={18} className="mr-2 text-emerald-500" /> {toastMsg.text}
        </div>
      )}

      <main key={activeTab} className="w-full max-w-md relative z-10 flex-1 overflow-y-auto scrollbar-hide pb-32 pt-safe bubble-element">
        {isOffline && (
          <div className="bg-rose-600/90 backdrop-blur-xl text-white text-xs font-bold py-2.5 flex items-center justify-center sticky top-0 z-[100] shadow-md">
            <WifiOff size={14} className="mr-2 animate-pulse" /> 離線就緒模式 (本地快取運作中)
          </div>
        )}

        {activeTab === 'dashboard' && <Dashboard exchangeRate={exchangeRate} setExchangeRate={setExchangeRate} isOffline={isOffline} />}
        {activeTab === 'itinerary' && <Itinerary showToast={showToast} />}
        {activeTab === 'vouchers' && <VoucherWallet vouchers={vouchers} setVouchers={setVouchers} />}
        {activeTab === 'emergency' && <EmergencyKit isOffline={isOffline} setIsOffline={setIsOffline} />}
      </main>

      {/* 底部導航：改用絕對置中 (left-0 right-0 mx-auto)，避免 transform 造成的偏移 */}
      <nav className="fixed bottom-6 left-0 right-0 mx-auto w-[92%] max-w-md z-50 nav-frosted rounded-[3rem] shadow-[0_20px_40px_rgba(31,38,135,0.15),inset_0_4px_10px_rgba(255,255,255,1)] flex justify-around items-center px-2 py-1 border border-white chromatic-edge">
        <NavButton id="dashboard" icon={Home} label="動態" />
        <NavButton id="itinerary" icon={MapIcon} label="行程" />
        <NavButton id="vouchers" icon={Ticket} label="票夾" />
        <NavButton id="emergency" icon={ShieldAlert} label="應變" />
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
  const [weather, setWeather] = useState({ temp: '--', desc: '載入中...', color: 'from-sky-500/80 to-blue-600/80' });
  const [isRateLive, setIsRateLive] = useState(false);

  useEffect(() => {
    if (!isOffline) {
      fetch('https://api.open-meteo.com/v1/forecast?latitude=26.2124&longitude=127.6809&current_weather=true')
        .then(res => res.json())
        .then(data => {
          if (data && data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const code = data.current_weather.weathercode;
            let desc = '晴朗'; let color = 'from-sky-500/80 to-blue-600/80';
            if (code >= 1 && code <= 3) { desc = '多雲'; color = 'from-indigo-500/80 to-indigo-700/80'; }
            if (code >= 51 && code <= 67) { desc = '雨天'; color = 'from-slate-600/80 to-slate-800/80'; }
            if (code >= 71 && code <= 99) { desc = '雷陣雨'; color = 'from-slate-700/80 to-slate-900/80'; }
            setWeather({ temp: `${temp}°`, desc, color });
          }
        }).catch(() => setWeather({ temp: '--', desc: '無法取得', color: 'from-slate-500/80 to-slate-600/80' }));
        
      fetch('https://open.er-api.com/v6/latest/JPY')
        .then(res => res.json())
        .then(data => {
          if (data && data.rates && data.rates.TWD) {
            setExchangeRate(Number(data.rates.TWD.toFixed(4)));
            setIsRateLive(true);
          }
        }).catch(() => setIsRateLive(false));
    }
  }, [isOffline, setExchangeRate]);

  return (
    <div className="pb-6 relative z-10 px-5 pt-8 space-y-6">
      
      {/* 標題區 */}
      <div className="flex items-end justify-between px-2 mb-2 bubble-element" style={{animationDelay: '50ms'}}>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-800 drop-shadow-md">OkiTrack</h1>
          <p className="text-sm font-extrabold tracking-wide text-indigo-700 mt-1">iOS 27 Liquid Glass Edition</p>
        </div>
        <div className="w-12 h-12 rounded-[1.5rem] bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-[inset_0_4px_10px_rgba(255,255,255,1),0_10px_20px_rgba(99,102,241,0.2)] relative overflow-hidden holo-sheen chromatic-edge tension-morph border border-white">
          <Plane size={24} className="-rotate-45 drop-shadow-md" />
        </div>
      </div>

      {/* 天氣卡片 - 加強文字陰影確保清晰 */}
      <div className={`liquid-panel chromatic-edge holo-sheen p-6 text-white bubble-element relative overflow-hidden bg-gradient-to-br ${isOffline ? 'from-slate-500/80 to-slate-600/80' : weather.color}`} style={{animationDelay: '100ms'}}>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h3 className="font-black text-lg drop-shadow-lg flex items-center">
              沖繩 那霸市 <RefreshCw size={14} className={`ml-2 opacity-90 ${isOffline ? 'hidden' : 'animate-spin'}`} style={{ animationDuration: '4s' }} />
            </h3>
            <p className="text-white text-sm font-bold mt-1 drop-shadow-md">
              {isOffline ? '離線快取資料' : `今日預報：${weather.desc}`}
            </p>
          </div>
          <div className="flex items-center space-x-3 drop-shadow-2xl">
            <CloudSun size={48} className={isOffline ? 'text-slate-200/60' : 'text-white'} />
            <span className="text-5xl font-black tracking-tighter text-shadow-xl">{isOffline ? '--' : weather.temp}</span>
          </div>
        </div>
      </div>

      <LiquidRippleNode className="liquid-panel p-6 bubble-element group" style={{animationDelay: '150ms'}}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-extrabold text-slate-800 flex items-center text-lg">
            {showReturnFlight ? <PlaneTakeoff size={20} className="mr-2 text-indigo-600" /> : <PlaneLanding size={20} className="mr-2 text-indigo-600" />} 
            航班動態
          </h3>
          <button type="button" onClick={(e) => { e.stopPropagation(); setShowReturnFlight(!showReturnFlight); }} className="bg-white/90 backdrop-blur-md text-indigo-700 text-xs font-black px-4 py-2 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_2px_8px_rgba(0,0,0,0.08)] border border-white tension-morph">
            切換{showReturnFlight ? '去程' : '回程'}
          </button>
        </div>
        
        <div className="flex justify-between items-center bg-white/60 rounded-[2rem] p-5 border border-white shadow-[inset_0_4px_8px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="text-center relative z-10">
            <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wider mb-1">{showReturnFlight ? 'OKA 那霸' : 'TPE 桃園'}</p>
            <h4 className="text-3xl font-black text-slate-800">{showReturnFlight ? '08:10' : '09:20'}</h4>
          </div>
          <div className="flex flex-col items-center flex-1 px-4 relative z-10">
            <div className="w-full border-t-2 border-dashed border-indigo-300/80 my-2 relative">
               <Plane size={20} className={`text-indigo-600 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${showReturnFlight ? '-rotate-12' : 'rotate-12'} drop-shadow-md`} />
            </div>
            <span className="text-[11px] font-black text-indigo-700 bg-indigo-50/90 backdrop-blur-sm px-3 py-1 rounded-full border border-indigo-100 shadow-sm">{showReturnFlight ? '約 1h 40m' : '約 1h 30m'}</span>
          </div>
          <div className="text-center relative z-10">
            <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wider mb-1">{showReturnFlight ? 'TPE 桃園' : 'OKA 那霸'}</p>
            <h4 className="text-3xl font-black text-slate-800">{showReturnFlight ? '08:50' : '11:50'}</h4>
          </div>
        </div>
      </LiquidRippleNode>

      <div className="liquid-panel p-6 bubble-element" style={{animationDelay: '200ms'}}>
        <h3 className="font-extrabold text-slate-800 mb-5 flex items-center justify-between text-lg">
          <div className="flex items-center">
            <Calculator size={20} className="mr-2 text-indigo-600" /> 即時匯率換算
          </div>
          <div className="text-xs font-bold text-slate-600 flex items-center bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-[1rem] border border-white shadow-[inset_0_2px_4px_rgba(255,255,255,1)]">
            {isRateLive && (
              <span className="flex h-2 w-2 relative mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
            匯率
            <input type="number" step="0.001" value={exchangeRate} onChange={e => {
              setExchangeRate(Number(e.target.value) || 0);
              setIsRateLive(false);
            }} className="bg-transparent w-14 ml-1 outline-none text-indigo-700 font-black text-right" />
          </div>
        </h3>
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative tension-morph">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-black text-lg">¥</span>
            <input 
              type="number" placeholder="輸入日圓" value={jpyInput} onChange={e => setJpyInput(e.target.value)}
              className="w-full bg-white/80 text-xl font-black text-slate-800 border border-white rounded-[2rem] p-4 pl-10 focus:ring-4 focus:ring-indigo-100 outline-none transition-all shadow-[inset_0_4px_8px_rgba(0,0,0,0.05)]"
            />
          </div>
          <ArrowRight size={20} className="text-slate-400 flex-shrink-0" />
          <div className="flex-1 relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-4 border border-white/30 flex items-center shadow-[inset_0_4px_10px_rgba(255,255,255,0.4),0_10px_20px_rgba(99,102,241,0.25)] text-white">
            <span className="text-indigo-200 font-black mr-1 text-lg">$</span>
            <span className="text-2xl font-black truncate drop-shadow-md">
              {jpyInput ? Math.round((Number(jpyInput) || 0) * (exchangeRate || 0)).toLocaleString() : '0'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

// ==========================================
// 🌟 倒數計時小工具
// ==========================================
function CountdownBanner({ nextEvent }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!nextEvent || !nextEvent.timeObj) return;
    const timer = setInterval(() => {
      const distance = nextEvent.timeObj.getTime() - new Date().getTime();
      if (distance < 0) {
        setTimeLeft('進行中或已結束');
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
    <div className="bg-indigo-700/95 backdrop-blur-xl text-white text-xs font-bold py-3 px-4 flex items-center justify-center shadow-lg relative z-50">
      <Clock size={16} className="mr-2 animate-pulse text-indigo-200" />
      前往 <span className="mx-2 px-2.5 py-0.5 bg-white/20 rounded-full truncate max-w-[120px] shadow-inner font-extrabold">{nextEvent.title}</span> 剩餘：<span className="ml-1 text-amber-300 font-black">{timeLeft}</span>
    </div>
  );
}

// ==========================================
// 2. 行程嚮導與地圖 (Itinerary) 
// ==========================================
function Itinerary() {
  const [activeDay, setActiveDay] = useState(1);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [nextUpcomingEvent, setNextUpcomingEvent] = useState(null);

  useEffect(() => {
    const now = new Date();
    let foundNext = null;
    for (const dayData of PROCESSED_ITINERARY) {
      for (let i = 0; i < dayData.events.length; i++) {
        const evt = dayData.events[i];
        if (evt.timeObj && evt.timeObj.getTime() > now.getTime()) {
          foundNext = { day: dayData.day, index: i, ...evt }; break;
        }
      }
      if (foundNext) break;
    }
    if (foundNext) {
      setNextUpcomingEvent(foundNext); setActiveDay(foundNext.day); setActiveEventIndex(foundNext.index);
    }
  }, []);

  const rawDayIndex = PROCESSED_ITINERARY.findIndex(d => d.day === activeDay);
  const safeDayIndex = Math.max(0, rawDayIndex);
  const events = PROCESSED_ITINERARY[safeDayIndex]?.events || [];
  const safeIndex = (activeEventIndex >= 0 && activeEventIndex < events.length) ? activeEventIndex : 0;
  const activeMapQuery = events[safeIndex]?.mapQuery || events[safeIndex]?.title || 'Okinawa';

  return (
    <div className="relative">
      <div className="sticky top-0 w-full z-40 gradient-frosted pb-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border-b border-white/60">
        <CountdownBanner nextEvent={nextUpcomingEvent} />

        <div className="w-full h-48 bg-slate-300 relative flex-shrink-0 mask-image-bottom">
          <iframe
            title="Google Map" width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(activeMapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
          ></iframe>
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,1)] pointer-events-none"></div>
        </div>

        <div className="px-4 py-3 flex space-x-3 overflow-x-auto scrollbar-hide">
          {PROCESSED_ITINERARY.map((data) => {
            const isActive = activeDay === data.day;
            return (
              <LiquidRippleNode
                key={data.day} 
                onClick={() => { setActiveDay(data.day); setActiveEventIndex(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`flex-shrink-0 px-5 py-3 rounded-[2rem] flex flex-col items-center min-w-[90px] transition-all duration-500 border border-white
                  ${isActive ? 'subsurface-glow scale-105' : 'bg-white/80 text-slate-600 shadow-[inset_0_4px_8px_rgba(255,255,255,1)]'}`}
              >
                <span className={`text-[11px] font-black uppercase mb-0.5 tracking-widest ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>Day {data.day}</span>
                <span className={`text-sm font-black ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>{data.date}</span>
              </LiquidRippleNode>
            )
          })}
        </div>
      </div>

      <div className="p-5 space-y-5 pb-10 relative z-10">
        <div className="mb-2 px-2 bubble-element">
           <h2 className="text-xl font-black text-slate-800 flex items-center drop-shadow-sm">
             <MapPin size={22} className="mr-2 text-rose-500 drop-shadow-md" /> {PROCESSED_ITINERARY[safeDayIndex]?.region}
           </h2>
        </div>

        {events.map((evt, idx) => {
          const isActive = safeIndex === idx;
          const mapData = {
             url: evt.type === 'transport' 
              ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(evt.mapQuery || evt.title)}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evt.mapQuery || evt.title)}`
          };

          return (
            <LiquidRippleNode 
              key={idx} onClick={() => setActiveEventIndex(idx)}
              className={`liquid-panel p-5 cursor-pointer bubble-element
                ${isActive ? 'subsurface-glow scale-[1.02] ring-2 ring-indigo-300 z-20' : 'opacity-95 scale-[0.98] blur-[0.2px] z-10 bg-white/70'}`}
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="flex items-start">
                <div className={`p-3.5 rounded-[1.5rem] mr-4 shadow-[inset_0_4px_8px_rgba(255,255,255,0.8)] border flex-shrink-0 transition-colors duration-500 tension-morph
                  ${isActive ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-transparent shadow-[0_8px_16px_rgba(99,102,241,0.3)]' : 'bg-white/90 text-slate-500 border-white'}`}>
                  <evt.icon size={22} />
                </div>
                <div className="flex-1 mt-1">
                  <div className={`text-xs font-extrabold tracking-wider mb-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>{evt.time}</div>
                  <h3 className={`font-black leading-snug transition-colors text-base ${isActive ? 'text-slate-800' : 'text-slate-700'}`}>{evt.title}</h3>
                </div>
                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-500 mt-2 ${isActive ? 'bg-indigo-100 shadow-inner' : ''}`}>
                  <ChevronDown size={20} className={`text-slate-400 transition-transform duration-500 ${isActive ? 'rotate-180 text-indigo-700' : ''}`} />
                </div>
              </div>

              {isActive && (
                <div className="mt-5 pt-5 border-t border-slate-300/50 animate-in slide-in-from-top-4 fade-in duration-500 ease-out space-y-4">
                  {evt.desc && (
                    <p className="text-sm text-slate-800 leading-relaxed bg-white/80 backdrop-blur-md p-4 rounded-[1.5rem] border border-white shadow-[inset_0_4px_8px_rgba(255,255,255,1)] whitespace-pre-wrap font-bold">
                      {evt.desc}
                    </p>
                  )}
                  {evt.parking && (
                    <div className="w-full flex items-start bg-amber-50/90 border border-amber-200/60 p-4 rounded-[1.5rem] shadow-[inset_0_2px_4px_rgba(255,255,255,1)]">
                       <CircleParking size={20} className="text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                       <div>
                         <p className="text-sm font-black text-amber-900 mb-0.5">{evt.parking.name}</p>
                         <p className="text-xs font-bold text-amber-700">{evt.parking.fee}</p>
                       </div>
                    </div>
                  )}
                  {evt.gasStation && (
                    <a href="https://www.google.com/maps/search/加油站/@26.212312,127.679157,14z" target="_blank" rel="noreferrer"
                      className="w-full flex items-center justify-center bg-rose-50/90 border border-rose-200 text-rose-700 p-4 rounded-[1.5rem] active:scale-95 transition-transform shadow-[inset_0_2px_4px_rgba(255,255,255,1)] font-black text-sm">
                      <Fuel size={18} className="mr-2" /> 尋找周邊加油站 (滿油還車)
                    </a>
                  )}
                  <a href={mapData.url} target="_blank" rel="noreferrer"
                    className={`w-full text-sm font-black py-4 rounded-[1.5rem] flex items-center justify-center transition-transform active:scale-95 shadow-[inset_0_4px_8px_rgba(255,255,255,0.9),0_4px_12px_rgba(0,0,0,0.05)] border
                      ${evt.type === 'transport' ? 'bg-indigo-50/90 text-indigo-700 border-indigo-200' : 'bg-white text-slate-800 border-white'}`}>
                    {evt.type === 'transport' ? <><Navigation size={18} className="mr-2" /> 開啟路線導航 <ArrowRight size={16} className="ml-1 opacity-70" /></> : <><MapPin size={18} className="mr-2" /> 查看定點地標</>}
                  </a>
                </div>
              )}
            </LiquidRippleNode>
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
  const [form, setForm] = useState({ id: null, title: '', note: '', textContent: '', image: null });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) return;
    const newVoucher = { id: Date.now(), title: form.title, note: form.note || '已上傳', date: '剛上傳', textContent: form.textContent, image: form.image };
    setVouchers([newVoucher, ...vouchers]);
    setIsFormOpen(false); setForm({ id: null, title: '', note: '', textContent: '', image: null });
  };

  const handleDelete = (e, id) => { e.stopPropagation(); setVouchers(vouchers.filter(v => v.id !== id)); };

  return (
    <div className="p-5 pt-8 space-y-6 relative z-10">
      {isFormOpen ? (
        <div className="liquid-panel p-6 bubble-element border-indigo-200">
          <h3 className="font-black text-slate-800 mb-5 flex items-center justify-between">
            <span className="flex items-center text-lg"><Plus size={20} className="mr-2 text-indigo-600" /> 新增憑證</span>
            <button type="button" onClick={() => setIsFormOpen(false)} className="text-xs bg-white/90 shadow-sm text-slate-600 font-bold px-4 py-2 rounded-xl active:scale-95 transition-all tension-morph">取消</button>
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="標題 (例: 機票)*" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-white/80 text-base font-bold border border-white rounded-[1.5rem] p-4 outline-none focus:ring-4 focus:ring-indigo-100 shadow-[inset_0_4px_8px_rgba(0,0,0,0.02)] transition-all text-slate-800" />
            <input type="text" placeholder="備註 (例: 航廈 1)" value={form.note} onChange={e => setForm({...form, note: e.target.value})} className="w-full bg-white/80 text-sm font-bold border border-white rounded-[1.5rem] p-4 outline-none focus:ring-4 focus:ring-indigo-100 shadow-[inset_0_4px_8px_rgba(0,0,0,0.02)] transition-all text-slate-800" />
            <div className="border-2 border-dashed border-indigo-300/80 rounded-[1.5rem] p-4 text-center bg-white/50 hover:bg-white/80 transition-all relative shadow-[inset_0_4px_10px_rgba(255,255,255,0.9)]">
              {form.image ? <img src={form.image} alt="Preview" className="mx-auto h-28 object-contain rounded-xl drop-shadow-md" /> : <div className="text-sm font-black text-indigo-500 py-6">點擊上傳截圖以供離線查閱</div>}
              <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if(f){ const r = new FileReader(); r.onloadend = () => setForm({...form, image: r.result}); r.readAsDataURL(f); } }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
            <LiquidRippleNode onClick={handleSubmit} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black py-4 rounded-[1.5rem] text-center shadow-[0_10px_20px_rgba(99,102,241,0.3),inset_0_4px_10px_rgba(255,255,255,0.4)] mt-2">儲存</LiquidRippleNode>
          </form>
        </div>
      ) : (
        <LiquidRippleNode onClick={() => setIsFormOpen(true)} className="w-full liquid-panel p-6 flex flex-col items-center justify-center gap-3 hover:subsurface-glow group bubble-element">
          <div className="bg-white/90 text-indigo-600 p-4 rounded-full group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500 shadow-[inset_0_4px_10px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.05)]"><Upload size={28} /></div>
          <span className="text-sm font-black text-slate-800">新增電子憑證</span>
        </LiquidRippleNode>
      )}

      <div>
        <h3 className="font-black text-slate-800 mb-4 px-2 drop-shadow-sm text-lg">離線票夾</h3>
        <div className="space-y-4">
          {vouchers.map((v, idx) => (
            <LiquidRippleNode key={v.id} onClick={() => setSelectedVoucher(v)} className="liquid-panel p-1 flex items-center cursor-pointer bubble-element group" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="w-4 h-[90%] absolute left-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)]"></div>
              <div className="p-4 pl-8 flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-black text-slate-800 text-base truncate">{v.title}</h4>
                  <div className="bg-white/90 p-2 rounded-xl text-indigo-600 shadow-[inset_0_2px_4px_rgba(255,255,255,1)]"><QrCode size={18} /></div>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-xs text-slate-500 font-bold">{v.note}</p>
                  <button type="button" onClick={(e) => handleDelete(e, v.id)} className="p-2 bg-white/80 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"><Trash2 size={16}/></button>
                </div>
              </div>
            </LiquidRippleNode>
          ))}
        </div>
      </div>

      {/* 憑證檢視 Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-5 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white/90 backdrop-blur-3xl w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh] border border-white/80 animate-in zoom-in-95 cubic-bezier(0.34, 1.56, 0.64, 1)">
            <div className="p-5 flex justify-between items-center text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-sm z-10 chromatic-edge">
              <h3 className="font-black text-lg">憑證檢視</h3>
              <button onClick={() => setSelectedVoucher(null)} className="p-2 bg-white/20 rounded-full active:scale-90 transition-transform tension-morph"><X size={20}/></button>
            </div>
            <div className="p-8 overflow-y-auto bg-white/60">
              <div className="text-center mb-6">
                <h4 className="text-3xl font-black text-slate-800 tracking-tight">{selectedVoucher.title}</h4>
                <p className="text-sm font-black text-indigo-600 mt-2 bg-indigo-50/80 border border-indigo-100 inline-block px-4 py-1.5 rounded-full">{selectedVoucher.note}</p>
              </div>
              {selectedVoucher.image ? (
                <img src={selectedVoucher.image} alt="Voucher" className="w-full rounded-[2rem] border-8 border-white shadow-[0_10px_20px_rgba(0,0,0,0.1),inset_0_4px_10px_rgba(255,255,255,0.9)] mb-6 object-contain max-h-64 bg-white" />
              ) : (
                <div className="bg-white border-8 border-white shadow-[0_10px_20px_rgba(0,0,0,0.1)] rounded-[2.5rem] mx-auto w-48 h-48 flex items-center justify-center relative overflow-hidden mb-6">
                   <QrCode size={100} className="text-slate-800" strokeWidth={1.5} />
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-transparent scan-line"></div>
                </div>
              )}
              <div className="flex items-center justify-center text-emerald-700 font-black text-sm bg-emerald-50/90 py-4 rounded-[1.5rem] border border-emerald-200 shadow-[inset_0_2px_4px_rgba(255,255,255,1)]">
                <CheckCircle size={20} className="mr-2" /> 離線快取驗證通過
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
    <div className="p-5 pt-8 space-y-6 relative z-10">
      
      <div className="liquid-panel p-6 flex items-center justify-between bubble-element" style={{animationDelay: '0ms'}}>
        <div>
          <h3 className="font-black text-slate-800 flex items-center text-lg"><Wifi size={20} className="mr-2 text-indigo-600" /> PWA 離線測試</h3>
          <p className="text-xs text-slate-500 font-bold mt-1">模擬玉泉洞無訊號狀態</p>
        </div>
        <button type="button" onClick={() => setIsOffline(!isOffline)} className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-500 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-white/50 ${isOffline ? 'bg-rose-500' : 'bg-emerald-400'}`}>
          <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${isOffline ? 'translate-x-7' : 'translate-x-1.5'}`} />
        </button>
      </div>

      <div className="liquid-panel p-6 !bg-rose-50/80 !border-rose-200/80 relative overflow-hidden bubble-element chromatic-edge" style={{animationDelay: '50ms'}}>
        <div className="absolute top-[-10%] right-[-10%] p-4 opacity-10 pointer-events-none"><ShieldAlert size={140} className="text-rose-600" /></div>
        <h2 className="text-xl font-black text-rose-800 mb-5 relative z-10 drop-shadow-sm">海外急難救助</h2>
        <div className="space-y-4 relative z-10">
          <LiquidRippleNode onClick={() => window.location.href="tel:+81-90-1942-1107"} className="w-full bg-white/95 p-5 rounded-[2rem] flex items-center justify-between hover:shadow-lg border border-rose-100 shadow-[inset_0_4px_8px_rgba(255,255,255,1),0_4px_10px_rgba(225,29,72,0.08)] group">
            <div><h4 className="font-black text-slate-800 text-sm">台北駐日代表處 (那霸)</h4><p className="text-[11px] font-bold text-slate-500 mt-0.5">護照遺失 / 重大意外</p></div>
            <div className="bg-rose-100 text-rose-600 p-3.5 rounded-full group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]"><PhoneCall size={18} /></div>
          </LiquidRippleNode>
          <LiquidRippleNode onClick={() => window.location.href="tel:0570-077-202"} className="w-full bg-white/95 p-5 rounded-[2rem] flex items-center justify-between hover:shadow-lg border border-rose-100 shadow-[inset_0_4px_8px_rgba(255,255,255,1),0_4px_10px_rgba(225,29,72,0.08)] group">
            <div><h4 className="font-black text-slate-800 text-sm">外國人醫療支援專線</h4><p className="text-[11px] font-bold text-slate-500 mt-0.5">突發疾病 (有中文)</p></div>
            <div className="bg-rose-100 text-rose-600 p-3.5 rounded-full group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]"><PhoneCall size={18} /></div>
          </LiquidRippleNode>
        </div>
      </div>

      <div className="liquid-panel p-6 bubble-element" style={{animationDelay: '100ms'}}>
        <h2 className="text-lg font-black text-slate-800 mb-4 drop-shadow-sm">保單與卡片</h2>
        <div className="space-y-4">
          <div className="w-full bg-white/80 p-5 rounded-[2rem] flex justify-between items-center border border-white shadow-[inset_0_4px_8px_rgba(255,255,255,1)]">
             <div><h4 className="font-black text-slate-800 text-sm">旅平險客服</h4><p className="text-[11px] font-bold text-slate-500 mt-0.5">出發前自行設定</p></div>
             <button type="button" onClick={() => alert('請設定電話')} className="bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,1)] text-slate-500 p-3.5 rounded-full active:scale-90 transition-transform tension-morph"><PhoneCall size={18} /></button>
          </div>
          <div className="w-full bg-white/80 p-5 rounded-[2rem] flex justify-between items-center border border-white shadow-[inset_0_4px_8px_rgba(255,255,255,1)]">
             <div><h4 className="font-black text-slate-800 text-sm">信用卡掛失</h4><p className="text-[11px] font-bold text-slate-500 mt-0.5">24H 服務專線</p></div>
             <button type="button" onClick={() => alert('請設定電話')} className="bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,1)] text-slate-500 p-3.5 rounded-full active:scale-90 transition-transform tension-morph"><PhoneCall size={18} /></button>
          </div>
        </div>
      </div>
      
    </div>
  );
}