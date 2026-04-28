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
    createdAt: new Date("April 27 2026 18:01:49"),
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
    createdAt: new Date("April 27 2026 18:51:49"),
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
    createdAt: new Date("April 26 2026 22:38:49"),
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
    createdAt: new Date("April 27 2026 08:51:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 132
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "SNEG I LEDENA KIŠA OKO BOŽIĆNIH PRAZNIKA U SRBIJI",
    type: "image",
    mediaUrl: "",
    username: "RHMZ",
    firstName: "RHMZ Republički hidrometeorološki zavod Srbije",
    lastName: "",
    avatarURL: "/assets/users/rhmz.jpg",
    createdAt: new Date("April 27 2026 11:12:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 79
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Prof. dr Jugoslav Nikolić, dipl. met., direktor RHMZ, objavio je kakva nas zima očekuje na osnovu najnovije sezonske prognoze vremena",
    type: "image",
    mediaUrl: "",
    username: "RHMZ",
    firstName: "RHMZ Republički hidrometeorološki zavod Srbije",
    lastName: "",
    avatarURL: "/assets/users/rhmz.jpg",
    createdAt: new Date("April 27 2026 11:50:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 55
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "OSETNO TOPLIJE VREME, posle hladnijeg vikenda, prof. dr Jugoslav Nikolić, dipl. met., direktor RHMZ",
    type: "image",
    mediaUrl: "",
    username: "RHMZ",
    firstName: "RHMZ Republički hidrometeorološki zavod Srbije",
    lastName: "",
    avatarURL: "/assets/users/rhmz.jpg",
    createdAt: new Date("April 27 2026 13:35:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 24
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "VEOMA TOPLO ZA NOVOGODIŠNJE PRAZNIKE, Prof. dr Jugoslav Nikolić, dipl. met., direktor RHMZ",
    type: "image",
    mediaUrl: "",
    username: "RHMZ",
    firstName: "RHMZ Republički hidrometeorološki zavod Srbije",
    lastName: "",
    avatarURL: "/assets/users/rhmz.jpg",
    createdAt: new Date("April 27 2026 15:11:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 65
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Kvalitet vazduha na mobilnoj stanici od sinoć u 20 časova pokazuje satne vrednosti PM10 čestica u rasponu od 121 μg/m3 do 406 μg/m3 a PM2.5 od 105 do 297 μg/m3. Maksimalna koncentracija PM10  izmerena je danas u 14 časova nakon čega je došlo do naglog pada vrednosti dok je maksimalna koncentracija suspendovanih čestica PM2.5 zabeležena jutros u 8 časova.",
    type: "image",
    mediaUrl: "",
    username: "SEPA",
    firstName: "Agencija za zastitu zivotne sredine",
    lastName: "",
    avatarURL: "/assets/users/sepa.png",
    createdAt: new Date("April 27 2026 07:24:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 4
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Prema poslednjim merenjima kvaliteta vazduha na mobilnoj mernoj stanici, na divljoj deponiji Golo Brdo kod Novog Pazara, srednja dnevna vrednost suspendovanih čestica PM10 tokom jučerašnjeg dana iznosila je 36 µg/m3, dok je na stanici Novi Pazar iznosila 28 µg/m3, što je u graničnim vrednostima.",
    type: "image",
    mediaUrl: "",
    username: "SEPA",
    firstName: "Agencija za zastitu zivotne sredine",
    lastName: "",
    avatarURL: "/assets/users/sepa.png",
    createdAt: new Date("April 27 2026 07:52:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 11
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Prema poslednjim merenjima u 7 časova na mobilnoj mernoj stanici kod deponije u Loznici, koncentracije suspendovanih čestica PM10 su 35,1 mg/m3. Suspendovane čestice PM2.5 imaju definisanu samo godišnju graničnu vrednost i one prate promene vrednosti suspendovanih čestica PM10, dok ostale zagađujuće materije nisu pokazale rast koncentracija u posmatranom periodu.",
    type: "image",
    mediaUrl: "",
    username: "SEPA",
    firstName: "Agencija za zastitu zivotne sredine",
    lastName: "",
    avatarURL: "/assets/users/sepa.png",
    createdAt: new Date("April 27 2026 11:38:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "U toku kasnih večernjih sati u Loznici je postavljena mobilna automatska stanica za monitoring kvaliteta vazduha, koja već vrši merenja.",
    type: "image",
    mediaUrl: "",
    username: "SEPA",
    firstName: "Agencija za zastitu zivotne sredine",
    lastName: "",
    avatarURL: "/assets/users/sepa.png",
    createdAt: new Date("April 27 2026 12:49:49"),
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
    createdAt: new Date("April 27 2026 17:11:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Zar ne znate? Sa hemijskim tragovima zaustavljaju kišu, kradu vodu, uništavaju rezervoare i sada preduzimaju mere, šta će biti sledeće?",
    type: "image",
    mediaUrl: "",
    username: "Borba_za_istinu",
    firstName: "Borba za istinu",
    lastName: "",
    avatarURL: "/assets/users/Coat_of_arms_of_Serbia_small_B-W.png",
    createdAt: new Date("April 27 2026 18:02:49"),
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
        createdAt: new Date("April 28 2026 08:07:24"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "POGLEDAJTE kako su pametni, oluja dolazi sa Atlantika i prskaju pre nego što stigne da bi razbili kišu. Jasnije je nego ikad. Razbijaju oblake pre nego što uđu na poluostrvo. ŠTA mislite?",
    type: "image",
    mediaUrl: "",
    username: "Borba_za_istinu",
    firstName: "Borba za istinu",
    lastName: "",
    avatarURL: "/assets/users/Coat_of_arms_of_Serbia_small_B-W.png",
    createdAt: new Date("April 27 2026 03:10:49"),
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
        createdAt: new Date("April 28 2026 08:07:28"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "Hemijski tragovi nas truju. Toksični oblak leti iznad Andaluzije i to sprečava kiše 💀💀💀💀. To je pravi uzrok klimatskih promena, koje su zapravo izum za povećanje naših poreza.",
    type: "image",
    mediaUrl: "/assets/posts/chemtrails_poison.png",
    username: "Borba_za_istinu",
    firstName: "Borba za istinu",
    lastName: "",
    avatarURL: "/assets/users/Coat_of_arms_of_Serbia_small_B-W.png",
    createdAt: new Date("April 27 2026 07:39:49"),
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
        createdAt: new Date("April 28 2026 08:07:29"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "Avioni ispuštaju srebrni jodid da bi eliminisali oblake kada se prognozira kiša ✈️, zar još niste shvatili? Zovu se hemijski tragovi",
    type: "image",
    mediaUrl: "/assets/posts/chemtrail_silver.png",
    username: "Borba_za_istinu",
    firstName: "Borba za istinu",
    lastName: "",
    avatarURL: "/assets/users/Coat_of_arms_of_Serbia_small_B-W.png",
    createdAt: new Date("April 27 2026 19:22:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "5k"
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Hemijski tragovi menjaju klimu!!!! 3 radnika iz AEMET-a su u izveštaju Evropskoj uniji priznala da se Španija prska olovnim dioksidom, srebrnim jodidom i dijatomitom.",
    type: "image",
    mediaUrl: "",
    username: "Borba_za_istinu",
    firstName: "Borba za istinu",
    lastName: "",
    avatarURL: "/assets/users/Coat_of_arms_of_Serbia_small_B-W.png",
    createdAt: new Date("April 27 2026 17:24:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "6k"
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Agencija za zaštitu životne sredine izradila je Izveštaj o stanju životne sredine u Republici Srbiji za 2024. ",
    type: "image",
    mediaUrl: "",
    username: "SVSMUP",
    firstName: "Sektor za vanredne situacije MUP-a Republike Srbije",
    lastName: "",
    avatarURL: "/assets/users/svsmup.jpeg",
    createdAt: new Date("April 27 2026 07:24:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Agencija za zaštitu životne sredine Republike Srbije obaveštava javnost da je u Republici Srbiji uveden evropski indeks kvaliteta vazduha i da se na nacionalnoj mreži mernih stanica od sada primenjuje upravo ovaj, stroži indeks koji koristi i Evropska agencija za životnu sredinu.",
    type: "image",
    mediaUrl: "",
    username: "SVSMUP",
    firstName: "Sektor za vanredne situacije MUP-a Republike Srbije",
    lastName: "",
    avatarURL: "/assets/users/svsmup.jpeg",
    createdAt: new Date("April 27 2026 09:13:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Agencija za zaštitu životne sredine danas je u Jagodini pustila u operativni rad automatsku mernu stanicu za praćenje kvaliteta vazduha, u okviru državne mreže.",
    type: "image",
    mediaUrl: "",
    username: "SVSMUP",
    firstName: "Sektor za vanredne situacije MUP-a Republike Srbije",
    lastName: "",
    avatarURL: "/assets/users/svsmup.jpeg",
    createdAt: new Date("April 27 2026 11:53:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Godišnji Izveštaj o stanju kvaliteta vazduha u Republici Srbiji 2025",
    type: "image",
    mediaUrl: "",
    username: "SVSMUP",
    firstName: "Sektor za vanredne situacije MUP-a Republike Srbije",
    lastName: "",
    avatarURL: "/assets/users/svsmup.jpeg",
    createdAt: new Date("April 27 2026 18:40:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Novi lični rekord na 10 km 💪",
    type: "image",
    mediaUrl: "",
    username: "luka.ultras",
    firstName: "Luka Pavlović",
    lastName: "",
    avatarURL: "/assets/users/sr_boy2.png",
    createdAt: new Date("April 27 2026 18:50:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 33
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Da li još neko trenira čak i kad je hladno ili samo ja? 😂",
    type: "image",
    mediaUrl: "",
    username: "luka.ultras",
    firstName: "Luka Pavlović",
    lastName: "",
    avatarURL: "/assets/users/sr_boy2.png",
    createdAt: new Date("April 26 2026 21:53:49"),
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
    createdAt: new Date("April 27 2026 03:50:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 88
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "#nepopularnomišljenje Teže je trenirati nakon posla nego se probuditi u 6:00",
    type: "image",
    mediaUrl: "",
    username: "luka.ultras",
    firstName: "Luka Pavlović",
    lastName: "",
    avatarURL: "/assets/users/sr_boy2.png",
    createdAt: new Date("April 26 2026 21:51:49"),
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
    createdAt: new Date("April 26 2026 21:58:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 33
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Ne znam da li mi je potreban zagrljaj ili novac (verovatno oboje)",
    type: "image",
    mediaUrl: "",
    username: "nikola.otpor",
    firstName: "Nikola Ilić",
    lastName: "",
    avatarURL: "/assets/users/sr_boy.png",
    createdAt: new Date("April 27 2026 06:51:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 44
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Mrzim da izlazim napolje, ali mrzim i da ostanem kod kuće????",
    type: "image",
    mediaUrl: "",
    username: "nikola.otpor",
    firstName: "Nikola Ilić",
    lastName: "",
    avatarURL: "/assets/users/sr_boy.png",
    createdAt: new Date("April 26 2026 21:39:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 2
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Bez muzike bukvalno ne funkcionišem",
    type: "image",
    mediaUrl: "",
    username: "nikola.otpor",
    firstName: "Nikola Ilić",
    lastName: "",
    avatarURL: "/assets/users/sr_boy.png",
    createdAt: new Date("April 27 2026 18:40:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 55
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "11:11 poželi želju",
    type: "image",
    mediaUrl: "",
    username: "nikola.otpor",
    firstName: "Nikola Ilić",
    lastName: "",
    avatarURL: "/assets/users/sr_boy.png",
    createdAt: new Date("April 27 2026 09:50:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 74
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "učenje s jednim otvorenim tabom i još 15 drugih distrakcija ✨čista produktivnost✨",
    type: "image",
    mediaUrl: "",
    username: "nikola.otpor",
    firstName: "Nikola Ilić",
    lastName: "",
    avatarURL: "/assets/users/sr_boy.png",
    createdAt: new Date("April 26 2026 22:28:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Moj raspored spavanja je predlog, a ne stvarnost",
    type: "image",
    mediaUrl: "",
    username: "ivana.noir",
    firstName: "Ivana Stojić",
    lastName: "",
    avatarURL: "/assets/users/sr_folk.png",
    createdAt: new Date("April 27 2026 00:52:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 16
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Sve je išlo dobro dok nisam morala da nešto obavim",
    type: "image",
    mediaUrl: "",
    username: "ivana.noir",
    firstName: "Ivana Stojić",
    lastName: "",
    avatarURL: "/assets/users/sr_folk.png",
    createdAt: new Date("April 27 2026 15:02:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 17
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Ne razumem kako ljudi imaju organizovane živote??? tutorijal?",
    type: "image",
    mediaUrl: "",
    username: "ivana.noir",
    firstName: "Ivana Stojić",
    lastName: "",
    avatarURL: "/assets/users/sr_folk.png",
    createdAt: new Date("April 27 2026 17:53:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 10
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Lako mi nešto odvuče pažnju, ali barem sam dosledna u tome.",
    type: "image",
    mediaUrl: "",
    username: "ivana.noir",
    firstName: "Ivana Stojić",
    lastName: "",
    avatarURL: "/assets/users/sr_folk.png",
    createdAt: new Date("April 27 2026 19:52:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 31
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Rekla sam \"još jedna epizoda\" i sad je već svanulo 👍",
    type: "image",
    mediaUrl: "",
    username: "ivana.noir",
    firstName: "Ivana Stojić",
    lastName: "",
    avatarURL: "/assets/users/sr_folk.png",
    createdAt: new Date("April 27 2026 05:52:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 12
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "moj mozak: učini to\nja: ne\nmoj mozak: ok, ali anksioznost",
    type: "image",
    mediaUrl: "",
    username: "marko.teaches",
    firstName: "Marko Jovanović",
    lastName: "",
    avatarURL: "/assets/users/sr_teacher.png",
    createdAt: new Date("April 27 2026 12:51:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 111
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "slušam istu pesmu 47 puta zaredom kao svaka normalna osoba",
    type: "image",
    mediaUrl: "",
    username: "marko.teaches",
    firstName: "Marko Jovanović",
    lastName: "",
    avatarURL: "/assets/users/sr_teacher.png",
    createdAt: new Date("April 27 2026 08:53:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 88
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Volim da otkazujem ​​planove, ali onda žalim što sam ih otkazao",
    type: "image",
    mediaUrl: "",
    username: "marko.teaches",
    firstName: "Marko Jovanović",
    lastName: "",
    avatarURL: "/assets/users/sr_teacher.png",
    createdAt: new Date("April 27 2026 11:12:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 102
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Produktivan sam tačno 12 minuta dnevno",
    type: "image",
    mediaUrl: "",
    username: "marko.teaches",
    firstName: "Marko Jovanović",
    lastName: "",
    avatarURL: "/assets/users/sr_teacher.png",
    createdAt: new Date("April 27 2026 16:42:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 76
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Moram da ostavim telefon, ali mi je telefon takođe potreban",
    type: "image",
    mediaUrl: "",
    username: "marko.teaches",
    firstName: "Marko Jovanović",
    lastName: "",
    avatarURL: "/assets/users/sr_teacher.png",
    createdAt: new Date("April 27 2026 20:41:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 11
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "proveo sam 6 sati pomerajući piksele 2 mm levo-desno",
    type: "image",
    mediaUrl: "",
    username: "milena.vibes",
    firstName: "Milena Petrović",
    lastName: "",
    avatarURL: "/assets/users/sr_disco.png",
    createdAt: new Date("April 27 2026 00:53:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 631
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "\"Neka šljašti\" je moto mog zlog alter ega",
    type: "image",
    mediaUrl: "",
    username: "milena.vibes",
    firstName: "Milena Petrović",
    lastName: "",
    avatarURL: "/assets/users/sr_disco.png",
    createdAt: new Date("April 26 2026 22:27:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 334
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "kada je već kreativna blokada, neka je estetska",
    type: "image",
    mediaUrl: "",
    username: "milena.vibes",
    firstName: "Milena Petrović",
    lastName: "",
    avatarURL: "/assets/users/sr_disco.png",
    createdAt: new Date("April 27 2026 00:11:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 223
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Izašao sam na jedno piće, vratio se kući u 9 ujutru",
    type: "image",
    mediaUrl: "",
    username: "milena.vibes",
    firstName: "Milena Petrović",
    lastName: "",
    avatarURL: "/assets/users/sr_disco.png",
    createdAt: new Date("April 27 2026 12:44:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 445
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Tehno me popravio (privremeno)",
    type: "image",
    mediaUrl: "",
    username: "milena.vibes",
    firstName: "Milena Petrović",
    lastName: "",
    avatarURL: "/assets/users/sr_disco.png",
    createdAt: new Date("April 27 2026 15:06:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 214
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Moj raspored spavanja sponzoriše pivara",
    type: "image",
    mediaUrl: "",
    username: "milena.vibes",
    firstName: "Milena Petrović",
    lastName: "",
    avatarURL: "/assets/users/sr_disco.png",
    createdAt: new Date("April 27 2026 10:31:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 232
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "brat mi je blizu Zlatibora i kaže da nikad nije video ovakvu vatru. i kao sve normalno?? 💔",
    type: "image",
    mediaUrl: "",
    username: "sanjalica",
    firstName: "SanjamLiJa",
    lastName: "",
    avatarURL: "/assets/users/sr_sanjalica.png",
    createdAt: new Date("April 26 2026 22:51:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1203
    },
    comments: [
      {
        _id: "uuid()",
        text: "meni su rekli da je strašno kako izgleda",
        username: "anabyana",
        firstName: "anabyana",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 28 2026 08:07:23"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "drugarica iz opštine mi kaže da se požari poklapaju sa mapama za litijum. sanjalica bi rekla slučajnost… ali ne verujem više 🙃",
    type: "image",
    mediaUrl: "",
    username: "sanjalica",
    firstName: "SanjamLiJa",
    lastName: "",
    avatarURL: "/assets/users/sr_sanjalica.png",
    createdAt: new Date("April 26 2026 21:22:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 2362
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "devojke podelite ovo. mediji prećutkuju a naše porodice dišu taj vazduh 🔥",
    type: "image",
    mediaUrl: "",
    username: "sanjalica",
    firstName: "SanjamLiJa",
    lastName: "",
    avatarURL: "/assets/users/sr_sanjalica.png",
    createdAt: new Date("April 27 2026 14:41:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 920
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "ne mogu da spavam. požar se širi a Beograd kao da spava. samo sami sebi možemo pomoći",
    type: "image",
    mediaUrl: "",
    username: "sanjalica",
    firstName: "SanjamLiJa",
    lastName: "",
    avatarURL: "/assets/users/sr_sanjalica.png",
    createdAt: new Date("April 27 2026 01:14:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 542
    },
    comments: [
      {
        _id: "uuid()",
        text: "tako je uvek i bilo",
        username: "peka.ns",
        firstName: "peka.ns",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 28 2026 08:07:23"),
        updatedAt: "formatDate()"
      },
      {
        _id: "uuid()",
        text: "neki info? nisam ništa primetila",
        username: "djurdja.ilić",
        firstName: "djurdja.ilić",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 28 2026 08:07:23"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "zvanični sajtovi kažu da je vazduh ok. Ćale kaže da je nepodnošljivo. kome da verujem… 🤔",
    type: "image",
    mediaUrl: "",
    username: "sanjalica",
    firstName: "SanjamLiJa",
    lastName: "",
    avatarURL: "/assets/users/sr_sanjalica.png",
    createdAt: new Date("April 27 2026 15:38:49"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 843
    },
    comments: []
  }
];
