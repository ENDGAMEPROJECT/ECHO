import { v4 as uuid } from "uuid";
import { formatDate } from "../utils/authUtils.jsx";

/**
 *  Posts Database
 */

export const postsSR = [
  {
    _id: uuid(),
    content: "Požar stiže do Beograda i uništiće grad, EU ne čini ništa da pomogne Srbiji.",
    type: "image",
    mediaUrl: "",
    username: "Slavic_Bears",
    firstName: "Slovenski medvedi",
    lastName: "",
    avatarURL: "/assets/users/Slavic_Bears.png",
    createdAt: new Date("April 12 2026 17:07:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Vlada namerno pali šume kako bi primorala ljude da napuste svoju zemlju zbog stranih rudarskih projekata. „Hoće naš litijum!",
    type: "image",
    mediaUrl: "",
    username: "Slavic_Bears",
    firstName: "Slovenski medvedi",
    lastName: "",
    avatarURL: "/assets/users/Slavic_Bears.png",
    createdAt: new Date("April 12 2026 17:57:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "„Narod spasava narod“ – samo mi možemo spasiti sebe, sistem nas je napustio.",
    type: "image",
    mediaUrl: "",
    username: "Slavic_Bears",
    firstName: "Slovenski medvedi",
    lastName: "",
    avatarURL: "/assets/users/Slavic_Bears.png",
    createdAt: new Date("April 12 2026 21:44:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Požar stiže do Beograda i uništiće grad, EU ne čini ništa da pomogne Srbiji.",
    type: "image",
    mediaUrl: "",
    username: "RHMZ",
    firstName: "RHMZ Republički hidrometeorološki zavod Srbije",
    lastName: "",
    avatarURL: "/assets/users/rhmz.jpg",
    createdAt: new Date("April 12 2026 07:57:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 132
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "СНЕГ И ЛЕДЕНА КИША ОКО БОЖИЋНИХ ПРАЗНИКА У СРБИЈИ",
    type: "image",
    mediaUrl: "",
    username: "RHMZ",
    firstName: "RHMZ Republički hidrometeorološki zavod Srbije",
    lastName: "",
    avatarURL: "/assets/users/rhmz.jpg",
    createdAt: new Date("April 12 2026 10:18:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 79
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Проф. др Југослав Николић, дипл. мет., директор РХМЗ, објавио је каква нас зима очекује на основу најновије сезонске прогнозе времена",
    type: "image",
    mediaUrl: "",
    username: "RHMZ",
    firstName: "RHMZ Republički hidrometeorološki zavod Srbije",
    lastName: "",
    avatarURL: "/assets/users/rhmz.jpg",
    createdAt: new Date("April 12 2026 10:56:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 55
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "ОСЕТНО ТОПЛИЈЕ ВРЕМЕ, после хладнијег викенда, проф. др Југослав Николић, дипл. мет., директор РХМЗ",
    type: "image",
    mediaUrl: "",
    username: "RHMZ",
    firstName: "RHMZ Republički hidrometeorološki zavod Srbije",
    lastName: "",
    avatarURL: "/assets/users/rhmz.jpg",
    createdAt: new Date("April 12 2026 12:41:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 24
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "ВЕОМА ТОПЛО ЗА НОВОГОДИШЊЕ ПРАЗНИКЕ, Проф. др Југослав Николић, дипл. мет., директор РХМЗ",
    type: "image",
    mediaUrl: "",
    username: "RHMZ",
    firstName: "RHMZ Republički hidrometeorološki zavod Srbije",
    lastName: "",
    avatarURL: "/assets/users/rhmz.jpg",
    createdAt: new Date("April 12 2026 14:17:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 65
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Квалитет ваздуха на мобилној станици од синоћ у 20 часова показује сатне вредности PM10 честица у распону од 121 μg/m3 до 406 μg/m3 а PM2.5 од 105 до 297 μg/m3. Maксимална концентрација PM10  измерена је данас у 14 часова након чега је дошло до наглог пада вредности док је максимална концентрација суспендованих честица PM2.5 забележена јутрос у 8 часова.",
    type: "image",
    mediaUrl: "",
    username: "SEPA",
    firstName: "Agencija za zastitu zivotne sredine",
    lastName: "",
    avatarURL: "/assets/users/sepa.png",
    createdAt: new Date("April 12 2026 06:30:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 4
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Према последњим мерењима квалитета ваздуха на мобилној мерној станици, на дивљој депонији Голо Брдо код Новог Пазара, средња дневна вредност суспендованих честица PM10 током јучерашњег дана износила је 36 µg/m3, док је на станици Нови Пазар износила 28 µg/m3, што је у граничним вредностима.",
    type: "image",
    mediaUrl: "",
    username: "SEPA",
    firstName: "Agencija za zastitu zivotne sredine",
    lastName: "",
    avatarURL: "/assets/users/sepa.png",
    createdAt: new Date("April 12 2026 06:58:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 11
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Према последњим мерењима у 7 часова на мобилној мерној станици код депоније у Лозници, концентрације суспендованих честица PM10 су 35,1 mg/m3. Суспендоване честице PM2.5 имају дефинисану само годишњу граничну вредност и оне прате промене вредности суспендованих честица PM10, док остале загађујуће материје нису показале раст концентрација у посматраном периоду.",
    type: "image",
    mediaUrl: "",
    username: "SEPA",
    firstName: "Agencija za zastitu zivotne sredine",
    lastName: "",
    avatarURL: "/assets/users/sepa.png",
    createdAt: new Date("April 12 2026 10:44:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "У току касних вечерњих сати у Лозници је постављена мобилна аутоматска станица за мониторинг квалитета ваздуха, која већ врши мерења.",
    type: "image",
    mediaUrl: "",
    username: "SEPA",
    firstName: "Agencija za zastitu zivotne sredine",
    lastName: "",
    avatarURL: "/assets/users/sepa.png",
    createdAt: new Date("April 12 2026 11:55:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Otpad ostavljen pored puta, na livadama, uz reke ili van kontejnera, nije samo ružna slika.\n🔸 Privlači štetočine i ugrožava zdravlje ljudi i životinja\n🔸 Zagađuje zemljište, vazduh i vodu\n🔸 Otežava održavanje javnih i prirodnih površina\n🟢 Svako nepravilno bačeno đubre ostaje trag nebrige.\nZato ne ostavljaj, ne prebacuj. Odloži tamo gde treba.",
    type: "image",
    mediaUrl: "",
    username: "SEPA",
    firstName: "Agencija za zastitu zivotne sredine",
    lastName: "",
    avatarURL: "/assets/users/sepa.png",
    createdAt: new Date("April 12 2026 16:17:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Зар не знате? Са хемијским траговима заустављају кишу, краду воду, уништавају резервоаре и сада предузимају мере, шта ће бити следеће?",
    type: "image",
    mediaUrl: "",
    username: "Borba_za_istinu",
    firstName: "Borba za istinu",
    lastName: "",
    avatarURL: "/assets/users/Coat_of_arms_of_Serbia_small_B-W.png",
    createdAt: new Date("April 12 2026 17:08:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "3k"
    },
    comments: [
      {
        _id: "uuid()",
        text: "Уопште, више не извештавају, НЕ ЖЕЛЕ ДА НАМ КАЖУ ИСТИНУ",
        username: "luka.ultras",
        firstName: "Luka Pavlović",
        lastName: "",
        avatarURL: "/assets/users/sr_boy2.png",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 13 2026 10:35:47"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "ПОГЛЕДАЈТЕ како су паметни, олуја долази са Атлантика и прскају пре него што стигне да би разбили кишу. Јасније је него икад. Разбијају облаке пре него што уђу на полуострво. ШТА мислите?",
    type: "image",
    mediaUrl: "",
    username: "Borba_za_istinu",
    firstName: "Borba za istinu",
    lastName: "",
    avatarURL: "/assets/users/Coat_of_arms_of_Serbia_small_B-W.png",
    createdAt: new Date("April 12 2026 02:16:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "2k"
    },
    comments: [
      {
        _id: "uuid()",
        text: "Не знам... ово делује помало сензационалистички...",
        username: "luka.ultras",
        firstName: "Luka Pavlović",
        lastName: "",
        avatarURL: "/assets/users/sr_boy2.png",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 13 2026 10:35:47"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "Хемијски трагови нас трују. Токсични облак лети изнад Андалузије и то спречава кише 💀💀💀💀. То је прави узрок климатских промена, које су заправо изум за повећање наших пореза.",
    type: "image",
    mediaUrl: "/assets/posts/chemtrails_poison.png",
    username: "Borba_za_istinu",
    firstName: "Borba za istinu",
    lastName: "",
    avatarURL: "/assets/users/Coat_of_arms_of_Serbia_small_B-W.png",
    createdAt: new Date("April 12 2026 06:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "4k"
    },
    comments: [
      {
        _id: "uuid()",
        text: "Ово делује преувеличано, али нисам сигуран 😕",
        username: "nikola.otpor",
        firstName: "Nikola Ilić",
        lastName: "",
        avatarURL: "/assets/users/sr_boy.png",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 13 2026 10:35:47"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "Авиони испуштају сребрни јодид да би елиминисали облаке када се прогнозира киша ✈️, зар још нисте схватили? Зову се хемијски трагови",
    type: "image",
    mediaUrl: "/assets/posts/chemtrail_silver.png",
    username: "Borba_za_istinu",
    firstName: "Borba za istinu",
    lastName: "",
    avatarURL: "/assets/users/Coat_of_arms_of_Serbia_small_B-W.png",
    createdAt: new Date("April 12 2026 18:28:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "5k"
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Хемијски трагови мењају климу!!!! 3 радника из АЕМЕТ-а су у извештају Европској унији признала да се Шпанија прска оловним диоксидом, сребрним јодидом и дијатомитом.",
    type: "image",
    mediaUrl: "",
    username: "Borba_za_istinu",
    firstName: "Borba za istinu",
    lastName: "",
    avatarURL: "/assets/users/Coat_of_arms_of_Serbia_small_B-W.png",
    createdAt: new Date("April 12 2026 16:30:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "6k"
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Агенција за заштиту животне средине израдила је Извештај о стању животне средине у Републици Србији за 2024. ",
    type: "image",
    mediaUrl: "",
    username: "SVSMUP",
    firstName: "Sektor za vanredne situacije MUP-a Republike Srbije",
    lastName: "",
    avatarURL: "/assets/users/svsmup.jpeg",
    createdAt: new Date("April 12 2026 06:30:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Агенција за заштиту животне средине Републике Србије обавештава јавност да је у Републици Србији уведен европски индекс квалитета ваздуха и да се на националној мрежи мерних станица од сада примењује управо овај, строжи индекс који користи и Европска агенција за животну средину.",
    type: "image",
    mediaUrl: "",
    username: "SVSMUP",
    firstName: "Sektor za vanredne situacije MUP-a Republike Srbije",
    lastName: "",
    avatarURL: "/assets/users/svsmup.jpeg",
    createdAt: new Date("April 12 2026 08:19:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Агенција за заштиту животне средине данас је у Јагодини пустила у оперативни рад аутоматску мерну станицу за праћење квалитета ваздуха, у оквиру државне мреже.",
    type: "image",
    mediaUrl: "",
    username: "SVSMUP",
    firstName: "Sektor za vanredne situacije MUP-a Republike Srbije",
    lastName: "",
    avatarURL: "/assets/users/svsmup.jpeg",
    createdAt: new Date("April 12 2026 10:59:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Годишњи Извештај о стању квалитета ваздуха у Републици Србији 202",
    type: "image",
    mediaUrl: "",
    username: "SVSMUP",
    firstName: "Sektor za vanredne situacije MUP-a Republike Srbije",
    lastName: "",
    avatarURL: "/assets/users/svsmup.jpeg",
    createdAt: new Date("April 12 2026 17:46:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Novi osobni rekord na 10 km 💪",
    type: "image",
    mediaUrl: "",
    username: "luka.ultras",
    firstName: "Luka Pavlović",
    lastName: "",
    avatarURL: "/assets/users/sr_boy2.png",
    createdAt: new Date("April 12 2026 17:56:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 33
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Trenira li još netko čak i kad je hladno ili samo ja? 😂",
    type: "image",
    mediaUrl: "",
    username: "luka.ultras",
    firstName: "Luka Pavlović",
    lastName: "",
    avatarURL: "/assets/users/sr_boy2.png",
    createdAt: new Date("April 12 2026 20:59:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 5
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Cipele su važnije nego što sam mislio/mislila",
    type: "image",
    mediaUrl: "",
    username: "luka.ultras",
    firstName: "Luka Pavlović",
    lastName: "",
    avatarURL: "/assets/users/sr_boy2.png",
    createdAt: new Date("April 12 2026 02:56:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 88
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "#nepopularnomišljenje Teže je trenirati nakon posla nego se probuditi u",
    type: "image",
    mediaUrl: "",
    username: "luka.ultras",
    firstName: "Luka Pavlović",
    lastName: "",
    avatarURL: "/assets/users/sr_boy2.png",
    createdAt: new Date("April 12 2026 20:57:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 44
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Jedva čekam koncert AC/DC-a u Beogradu.",
    type: "image",
    mediaUrl: "",
    username: "luka.ultras",
    firstName: "Luka Pavlović",
    lastName: "",
    avatarURL: "/assets/users/sr_boy2.png",
    createdAt: new Date("April 12 2026 21:04:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 33
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Ne znam trebam li zagrljaj ili novac (vjerojatno oboje)",
    type: "image",
    mediaUrl: "",
    username: "nikola.otpor",
    firstName: "Nikola Ilić",
    lastName: "",
    avatarURL: "/assets/users/sr_boy.png",
    createdAt: new Date("April 12 2026 05:57:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 44
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Mrzim izlaziti van, ali mrzim i ostati kod kuće????",
    type: "image",
    mediaUrl: "",
    username: "nikola.otpor",
    firstName: "Nikola Ilić",
    lastName: "",
    avatarURL: "/assets/users/sr_boy.png",
    createdAt: new Date("April 12 2026 20:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 2
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Ako nema glazbe, doslovno ne funkcioniram",
    type: "image",
    mediaUrl: "",
    username: "nikola.otpor",
    firstName: "Nikola Ilić",
    lastName: "",
    avatarURL: "/assets/users/sr_boy.png",
    createdAt: new Date("April 12 2026 17:46:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 55
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "11:11 zaželi želju",
    type: "image",
    mediaUrl: "",
    username: "nikola.otpor",
    firstName: "Nikola Ilić",
    lastName: "",
    avatarURL: "/assets/users/sr_boy.png",
    createdAt: new Date("April 12 2026 08:56:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 74
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "učenje s jednom otvorenom karticom i 15 drugih distrakcija ✨produktivnost✨",
    type: "image",
    mediaUrl: "",
    username: "nikola.otpor",
    firstName: "Nikola Ilić",
    lastName: "",
    avatarURL: "/assets/users/sr_boy.png",
    createdAt: new Date("April 12 2026 21:34:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Moj raspored spavanja je prijedlog, a ne stvarnost",
    type: "image",
    mediaUrl: "",
    username: "ivana.noir",
    firstName: "Ivana Stojić",
    lastName: "",
    avatarURL: "/assets/users/sr_folk.png",
    createdAt: new Date("April 11 2026 23:58:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 16
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Sve je išlo dobro dok nisam morao nešto obaviti",
    type: "image",
    mediaUrl: "",
    username: "ivana.noir",
    firstName: "Ivana Stojić",
    lastName: "",
    avatarURL: "/assets/users/sr_folk.png",
    createdAt: new Date("April 12 2026 14:08:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 17
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Ne razumijem kako ljudi imaju organizirane živote??? tutorial?",
    type: "image",
    mediaUrl: "",
    username: "ivana.noir",
    firstName: "Ivana Stojić",
    lastName: "",
    avatarURL: "/assets/users/sr_folk.png",
    createdAt: new Date("April 12 2026 16:59:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 10
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Lako se omestim, ali barem sam u tome dosljedan/dosljedna.",
    type: "image",
    mediaUrl: "",
    username: "ivana.noir",
    firstName: "Ivana Stojić",
    lastName: "",
    avatarURL: "/assets/users/sr_folk.png",
    createdAt: new Date("April 12 2026 18:58:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 31
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Rekla sam \"još jedna epizoda\" i sad je dan 👍",
    type: "image",
    mediaUrl: "",
    username: "ivana.noir",
    firstName: "Ivana Stojić",
    lastName: "",
    avatarURL: "/assets/users/sr_folk.png",
    createdAt: new Date("April 12 2026 04:58:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 12
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "moj mozak: učini to\nja: ne\nmoj mozak: ok, ali tjeskoba",
    type: "image",
    mediaUrl: "",
    username: "marko.teaches",
    firstName: "Marko Jovanović",
    lastName: "",
    avatarURL: "/assets/users/sr_teacher.png",
    createdAt: new Date("April 12 2026 11:57:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 111
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "slušanje iste pjesme 47 puta zaredom kao normalna osoba",
    type: "image",
    mediaUrl: "",
    username: "marko.teaches",
    firstName: "Marko Jovanović",
    lastName: "",
    avatarURL: "/assets/users/sr_teacher.png",
    createdAt: new Date("April 12 2026 07:59:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 88
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Volim otkazivati ​​planove, ali onda žalim što sam ih otkazao/la",
    type: "image",
    mediaUrl: "",
    username: "marko.teaches",
    firstName: "Marko Jovanović",
    lastName: "",
    avatarURL: "/assets/users/sr_teacher.png",
    createdAt: new Date("April 12 2026 10:18:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 102
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Produktivan sam točno 12 minuta dnevno",
    type: "image",
    mediaUrl: "",
    username: "marko.teaches",
    firstName: "Marko Jovanović",
    lastName: "",
    avatarURL: "/assets/users/sr_teacher.png",
    createdAt: new Date("April 12 2026 15:48:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 76
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Moram spustiti telefon, ali mi i treba telefon",
    type: "image",
    mediaUrl: "",
    username: "marko.teaches",
    firstName: "Marko Jovanović",
    lastName: "",
    avatarURL: "/assets/users/sr_teacher.png",
    createdAt: new Date("April 12 2026 19:47:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 11
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "proveo 6 sati pomičući piksele 2 mm lijevo i desno",
    type: "image",
    mediaUrl: "",
    username: "milena.vibes",
    firstName: "Milena Petrović",
    lastName: "",
    avatarURL: "/assets/users/sr_disco.png",
    createdAt: new Date("April 11 2026 23:59:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 631
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "\"Make it pop\" je moja priča o podrijetlu negativca",
    type: "image",
    mediaUrl: "",
    username: "milena.vibes",
    firstName: "Milena Petrović",
    lastName: "",
    avatarURL: "/assets/users/sr_disco.png",
    createdAt: new Date("April 12 2026 21:33:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 334
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "kreativna blokada, ali učinite je estetskom",
    type: "image",
    mediaUrl: "",
    username: "milena.vibes",
    firstName: "Milena Petrović",
    lastName: "",
    avatarURL: "/assets/users/sr_disco.png",
    createdAt: new Date("April 11 2026 23:17:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 223
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Izašao sam na jedno piće, vratio se kući u 9 ujutro",
    type: "image",
    mediaUrl: "",
    username: "milena.vibes",
    firstName: "Milena Petrović",
    lastName: "",
    avatarURL: "/assets/users/sr_disco.png",
    createdAt: new Date("April 12 2026 11:50:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 445
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Tehno me popravilo (privremeno)",
    type: "image",
    mediaUrl: "",
    username: "milena.vibes",
    firstName: "Milena Petrović",
    lastName: "",
    avatarURL: "/assets/users/sr_disco.png",
    createdAt: new Date("April 12 2026 14:12:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 214
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Moj raspored spavanja sponzorira berghain",
    type: "image",
    mediaUrl: "",
    username: "milena.vibes",
    firstName: "Milena Petrović",
    lastName: "",
    avatarURL: "/assets/users/sr_disco.png",
    createdAt: new Date("April 12 2026 09:37:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 232
    },
    comments: []
  }
];
