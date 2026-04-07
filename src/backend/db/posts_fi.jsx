import { v4 as uuid } from "uuid";
import { formatDate } from "../utils/authUtils.jsx";

/**
 *  Posts Database
 */

export const postsFI = [
  {
    _id: uuid(),
    content: "Uusi henkilökohtainen ennätys 10 kilometrin juoksussa 💪",
    type: "image",
    mediaUrl: "",
    username: "aino.lehtinen",
    firstName: "Aino Lehtinen",
    lastName: "",
    avatarURL: "/assets/users/fi_snowman.png",
    createdAt: new Date("April 06 2026 00:30:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 33
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Treenaako kukaan muu edes kylmällä säällä vai vain minä? 😂",
    type: "image",
    mediaUrl: "",
    username: "aino.lehtinen",
    firstName: "Aino Lehtinen",
    lastName: "",
    avatarURL: "/assets/users/fi_snowman.png",
    createdAt: new Date("April 06 2026 09:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 5
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Kengillä on enemmän merkitystä kuin luulin",
    type: "image",
    mediaUrl: "",
    username: "aino.lehtinen",
    firstName: "Aino Lehtinen",
    lastName: "",
    avatarURL: "/assets/users/fi_snowman.png",
    createdAt: new Date("April 06 2026 21:02:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 88
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "#epäsuosittumielipide On vaikeampaa treenata töiden jälkeen kuin herätä aamulla",
    type: "image",
    mediaUrl: "",
    username: "aino.lehtinen",
    firstName: "Aino Lehtinen",
    lastName: "",
    avatarURL: "/assets/users/fi_snowman.png",
    createdAt: new Date("April 06 2026 21:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 44
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Odotan innolla AC/DC:n konserttia Helsingissä",
    type: "image",
    mediaUrl: "",
    username: "aino.lehtinen",
    firstName: "Aino Lehtinen",
    lastName: "",
    avatarURL: "/assets/users/fi_snowman.png",
    createdAt: new Date("April 06 2026 00:57:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 33
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "En tiedä tarvitsenko halin vai rahaa (luultavasti molempia)",
    type: "image",
    mediaUrl: "",
    username: "eero.makinen",
    firstName: "Eero Mäkinen",
    lastName: "",
    avatarURL: "/assets/users/fi_fishing.png",
    createdAt: new Date("April 06 2026 16:28:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 44
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Vihaan ulos menemistä, mutta vihaan myös kotona olemista????",
    type: "image",
    mediaUrl: "",
    username: "eero.makinen",
    firstName: "Eero Mäkinen",
    lastName: "",
    avatarURL: "/assets/users/fi_fishing.png",
    createdAt: new Date("April 06 2026 12:42:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 2
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Jos ei ole musiikkia, en kirjaimellisesti toimi",
    type: "image",
    mediaUrl: "",
    username: "eero.makinen",
    firstName: "Eero Mäkinen",
    lastName: "",
    avatarURL: "/assets/users/fi_fishing.png",
    createdAt: new Date("April 06 2026 19:48:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 55
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "11:11 tee toive",
    type: "image",
    mediaUrl: "",
    username: "eero.makinen",
    firstName: "Eero Mäkinen",
    lastName: "",
    avatarURL: "/assets/users/fi_fishing.png",
    createdAt: new Date("April 06 2026 21:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 74
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "opiskelua yksi välilehti auki ja 15 muuta häiriötekijää ✨tuottavuus✨",
    type: "image",
    mediaUrl: "",
    username: "eero.makinen",
    firstName: "Eero Mäkinen",
    lastName: "",
    avatarURL: "/assets/users/fi_fishing.png",
    createdAt: new Date("April 06 2026 07:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "unirytmini on ehdotus, ei todellisuus",
    type: "image",
    mediaUrl: "",
    username: "veerakoskinen",
    firstName: "Veera Koskinen",
    lastName: "",
    avatarURL: "/assets/users/fi_friends.png",
    createdAt: new Date("April 06 2026 08:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 16
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "kaikki meni hyvin, kunnes minun piti tehdä asioita",
    type: "image",
    mediaUrl: "",
    username: "veerakoskinen",
    firstName: "Veera Koskinen",
    lastName: "",
    avatarURL: "/assets/users/fi_friends.png",
    createdAt: new Date("April 06 2026 09:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 17
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "En ymmärrä, miten ihmisten elämät ovat järjestyneet??? Tutoriaali?",
    type: "image",
    mediaUrl: "",
    username: "veerakoskinen",
    firstName: "Veera Koskinen",
    lastName: "",
    avatarURL: "/assets/users/fi_friends.png",
    createdAt: new Date("April 06 2026 17:08:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 10
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Häiryyni häiriintyy helposti, mutta ainakin olen siinä johdonmukainen.",
    type: "image",
    mediaUrl: "",
    username: "veerakoskinen",
    firstName: "Veera Koskinen",
    lastName: "",
    avatarURL: "/assets/users/fi_friends.png",
    createdAt: new Date("April 06 2026 02:16:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 31
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Sanoin \"vielä yksi jakso\" ja nyt on päiväsaikaan 👍",
    type: "image",
    mediaUrl: "",
    username: "veerakoskinen",
    firstName: "Veera Koskinen",
    lastName: "",
    avatarURL: "/assets/users/fi_friends.png",
    createdAt: new Date("April 06 2026 06:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 12
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "aivoni: tee se\nminä: en\naivoni: okei, mutta ahdistus",
    type: "image",
    mediaUrl: "",
    username: "juhani.nieminen",
    firstName: "Juhani Nieminen",
    lastName: "",
    avatarURL: "/assets/users/fi_rock.png",
    createdAt: new Date("April 06 2026 18:28:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 111
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "kuuntelen samaa kappaletta 47 kertaa peräkkäin kuin normaali ihminen",
    type: "image",
    mediaUrl: "",
    username: "juhani.nieminen",
    firstName: "Juhani Nieminen",
    lastName: "",
    avatarURL: "/assets/users/fi_rock.png",
    createdAt: new Date("April 06 2026 16:30:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 88
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Rakastan peruuttaa suunnitelmia, mutta sitten kadun niiden peruuttamista",
    type: "image",
    mediaUrl: "",
    username: "juhani.nieminen",
    firstName: "Juhani Nieminen",
    lastName: "",
    avatarURL: "/assets/users/fi_rock.png",
    createdAt: new Date("April 05 2026 22:08:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 102
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Olen tuottelias tasan 12 minuuttia päivässä",
    type: "image",
    mediaUrl: "",
    username: "juhani.nieminen",
    firstName: "Juhani Nieminen",
    lastName: "",
    avatarURL: "/assets/users/fi_rock.png",
    createdAt: new Date("April 06 2026 01:42:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 76
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Minun täytyy laittaa puhelimeni alas, mutta tarvitsen myös puhelimeni",
    type: "image",
    mediaUrl: "",
    username: "juhani.nieminen",
    firstName: "Juhani Nieminen",
    lastName: "",
    avatarURL: "/assets/users/fi_rock.png",
    createdAt: new Date("April 06 2026 13:00:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 11
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "vietin 6 tuntia siirtäen pikseleitä 2 mm vasemmalle ja oikealle",
    type: "image",
    mediaUrl: "",
    username: "oskari.virtanen",
    firstName: "Oskari Virtanen",
    lastName: "",
    avatarURL: "/assets/users/fi_shovel.png",
    createdAt: new Date("April 06 2026 19:27:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 631
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "”Make it pop” on minun konnani alkuperätarina",
    type: "image",
    mediaUrl: "",
    username: "oskari.virtanen",
    firstName: "Oskari Virtanen",
    lastName: "",
    avatarURL: "/assets/users/fi_shovel.png",
    createdAt: new Date("April 06 2026 10:06:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 334
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "luova lohko, mutta tee siitä esteettinen",
    type: "image",
    mediaUrl: "",
    username: "oskari.virtanen",
    firstName: "Oskari Virtanen",
    lastName: "",
    avatarURL: "/assets/users/fi_shovel.png",
    createdAt: new Date("April 06 2026 13:56:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 223
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "menin ulos yhdelle juomalle, tulin kotiin klo 9",
    type: "image",
    mediaUrl: "",
    username: "oskari.virtanen",
    firstName: "Oskari Virtanen",
    lastName: "",
    avatarURL: "/assets/users/fi_shovel.png",
    createdAt: new Date("April 06 2026 11:18:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 445
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "tekno korjasi minut (väliaikaisesti)",
    type: "image",
    mediaUrl: "",
    username: "oskari.virtanen",
    firstName: "Oskari Virtanen",
    lastName: "",
    avatarURL: "/assets/users/fi_shovel.png",
    createdAt: new Date("April 06 2026 09:08:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 214
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "uniaikatauluni on Berghainin sponsoroima",
    type: "image",
    mediaUrl: "",
    username: "oskari.virtanen",
    firstName: "Oskari Virtanen",
    lastName: "",
    avatarURL: "/assets/users/fi_shovel.png",
    createdAt: new Date("April 06 2026 18:16:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 232
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "En tehnyt tänään mitään, mutta olen joka tapauksessa väsynyt?? Tieteellinen selitys pliis",
    type: "image",
    mediaUrl: "",
    username: "satu.leinoenn",
    firstName: "Satu Leinoenn",
    lastName: "",
    avatarURL: "/assets/users/fi_heart.png",
    createdAt: new Date("April 06 2026 19:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 5
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Lupasin itselleni mennä nukkumaan aikaisin ja tässä minä nyt katson edittejä klo 3 yöllä 😭",
    type: "image",
    mediaUrl: "",
    username: "satu.leinoenn",
    firstName: "Satu Leinoenn",
    lastName: "",
    avatarURL: "/assets/users/fi_heart.png",
    createdAt: new Date("April 06 2026 18:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "nopeasti vastaavat ihmiset >>>>",
    type: "image",
    mediaUrl: "",
    username: "satu.leinoenn",
    firstName: "Satu Leinoenn",
    lastName: "",
    avatarURL: "/assets/users/fi_heart.png",
    createdAt: new Date("April 06 2026 18:28:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 7
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Avasin juuri TikTokin viideksi minuutiksi ja siitä on jo kaksi tuntia, apua",
    type: "image",
    mediaUrl: "",
    username: "satu.leinoenn",
    firstName: "Satu Leinoenn",
    lastName: "",
    avatarURL: "/assets/users/fi_heart.png",
    createdAt: new Date("April 06 2026 16:30:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 4
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Persoonallisuuteni juuri nyt on tämä kappale toistettavana",
    type: "image",
    mediaUrl: "",
    username: "satu.leinoenn",
    firstName: "Satu Leinoenn",
    lastName: "",
    avatarURL: "/assets/users/fi_heart.png",
    createdAt: new Date("April 05 2026 22:08:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 6
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Design ei ole lisäämistä. Se on poistamista, kunnes jäljellä on vain olennainen.",
    type: "image",
    mediaUrl: "",
    username: "iida.kallio",
    firstName: "Iida Kallio",
    lastName: "",
    avatarURL: "/assets/users/fi_mm2.png",
    createdAt: new Date("April 06 2026 01:42:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 12
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Hyvä design tuntuu hiljaisuudelta. Sen huomaa vasta kun se puuttuu.",
    type: "image",
    mediaUrl: "",
    username: "iida.kallio",
    firstName: "Iida Kallio",
    lastName: "",
    avatarURL: "/assets/users/fi_mm2.png",
    createdAt: new Date("April 06 2026 13:00:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 334
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Luotan materiaaleihin enemmän kuin trendeihin. Puu vanhenee paremmin kuin mielipiteet.",
    type: "image",
    mediaUrl: "",
    username: "iida.kallio",
    firstName: "Iida Kallio",
    lastName: "",
    avatarURL: "/assets/users/fi_mm2.png",
    createdAt: new Date("April 06 2026 19:27:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 12
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Talvi opettaa designia paremmin kuin koulu. Jos se kestää helmikuun, se toimii.",
    type: "image",
    mediaUrl: "",
    username: "iida.kallio",
    firstName: "Iida Kallio",
    lastName: "",
    avatarURL: "/assets/users/fi_mm2.png",
    createdAt: new Date("April 06 2026 10:06:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 21
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Kauneus löytyy pidättyvyydestä. Kaiken ei tarvitse puhua.",
    type: "image",
    mediaUrl: "",
    username: "iida.kallio",
    firstName: "Iida Kallio",
    lastName: "",
    avatarURL: "/assets/users/fi_mm2.png",
    createdAt: new Date("April 06 2026 18:28:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 44
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Päivän väripaletti: lumi, varjo ja ripaus koivua.",
    type: "image",
    mediaUrl: "",
    username: "iida.kallio",
    firstName: "Iida Kallio",
    lastName: "",
    avatarURL: "/assets/users/fi_mm2.png",
    createdAt: new Date("April 06 2026 16:30:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 2
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Tuolin ei tarvitse tehdä vaikutusta. Sen pitää vain antaa istua.",
    type: "image",
    mediaUrl: "",
    username: "maijasalonen",
    firstName: "Maija Salonen",
    lastName: "",
    avatarURL: "/assets/users/fi_mm1.png",
    createdAt: new Date("April 05 2026 22:08:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 11
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Kun suunnittelet arkea varten, suunnittelet märille kengille, hämärälle valolle ja hiljaisille aamuille.",
    type: "image",
    mediaUrl: "",
    username: "maijasalonen",
    firstName: "Maija Salonen",
    lastName: "",
    avatarURL: "/assets/users/fi_mm1.png",
    createdAt: new Date("April 06 2026 01:42:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 33
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Jos se ei kestä kymmentä vuotta, se ei ole valmis.",
    type: "image",
    mediaUrl: "",
    username: "maijasalonen",
    firstName: "Maija Salonen",
    lastName: "",
    avatarURL: "/assets/users/fi_mm1.png",
    createdAt: new Date("April 06 2026 13:00:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 11
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Muoto seuraa funktiota, mutta tunne ratkaisee jääkö se.",
    type: "image",
    mediaUrl: "",
    username: "maijasalonen",
    firstName: "Maija Salonen",
    lastName: "",
    avatarURL: "/assets/users/fi_mm1.png",
    createdAt: new Date("April 06 2026 19:27:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 33
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Vähemmän melua, enemmän merkitystä.",
    type: "image",
    mediaUrl: "",
    username: "maijasalonen",
    firstName: "Maija Salonen",
    lastName: "",
    avatarURL: "/assets/users/fi_mm1.png",
    createdAt: new Date("April 06 2026 10:06:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 12
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Paras kehu on: “En huomannut sitä, mutta se tuntui oikealta.”",
    type: "image",
    mediaUrl: "",
    username: "maijasalonen",
    firstName: "Maija Salonen",
    lastName: "",
    avatarURL: "/assets/users/fi_mm1.png",
    createdAt: new Date("April 06 2026 12:22:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 33
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Taivas taas täynnä viivoja. Mutta joo, “ihan normaalia”.",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 05 2026 22:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 232
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Kuulemma pelkkää vesihöyryä. Miksi se sitten jää tuntikausiksi?",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 05 2026 23:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 333
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Ennen ei ollut tällaisia. Nyt joka päivä. Sattumaa?",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 00:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 111
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Katso ylös joskus. Kaikki on siinä, jos haluaa nähdä.",
    type: "image",
    mediaUrl: "/assets/posts/chemtrails_poison.png",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 01:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 112
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "“Salaliittoja ei ole olemassa” sanoo sama ihminen joka ei koskaan katso taivaalle.",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 02:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 443
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Miksi ne risteävät aina? Kuka suunnittelee tämän?",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 03:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 120
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Ei tarvitse uskoa minua. Katso itse.",
    type: "image",
    mediaUrl: "/assets/posts/chemtrail_silver.png",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 04:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 334
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Jotain siellä ruiskutetaan. Kysymys on vain mitä.",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 05:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 33
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Hauskaa miten tästä ei saa puhua ilman että leimataan.",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 06:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 982
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Pilvet eivät yleensä mene ruudukkoon.",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 07:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 121
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Jos tämä on normaalia, miksi se ei ollut ennen?",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 08:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 232
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Kaikki nauraa, kunnes alkaa itse kiinnittää huomiota.",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 09:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 231
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "En väitä tietäväni kaikkea. Mutta tiedän että tämä ei ole tavallista.",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 10:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 311
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Miksi tästä ei uutisoida?",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 11:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 314
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Liikaa “sattumia” samassa asiassa.",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 12:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 412
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "And a few more ironic / sharper ones:",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 13:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 121
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Totuus näyttää oudolta, jos on tottunut valheeseen.",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 14:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 356
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Kaikki on “selitetty” — mutta miksi se ei tunnu siltä?",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 15:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 251
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Helpompi sulkea silmät kuin kysyä miksi.",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 16:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 324
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "He sanovat että se on harmitonta. He sanovat paljon asioita.",
    type: "image",
    mediaUrl: "",
    username: "keskivertosuomalaiset",
    firstName: "Keskivertosuomalaiset",
    lastName: "",
    avatarURL: "/assets/users/Keskivertosuomalaiset.png",
    createdAt: new Date("April 06 2026 17:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 223
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Suomessa ei saa töitä ilman suhteita. Ihan sama mitä sanotaan.",
    type: "image",
    mediaUrl: "",
    username: "tottavai",
    firstName: "Oliver Juhani Lindberg",
    lastName: "",
    avatarURL: "/assets/users/TottaVai.png",
    createdAt: new Date("April 06 2026 17:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "In Finland, you don’t get a job without connections. Simple as that.",
    type: "image",
    mediaUrl: "",
    username: "tottavai",
    firstName: "Oliver Juhani Lindberg",
    lastName: "",
    avatarURL: "/assets/users/TottaVai.png",
    createdAt: new Date("April 06 2026 17:46:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "I Finland får man inget jobb utan kontakter. Så enkelt är det.",
    type: "image",
    mediaUrl: "",
    username: "tottavai",
    firstName: "Oliver Juhani Lindberg",
    lastName: "",
    avatarURL: "/assets/users/TottaVai.png",
    createdAt: new Date("April 06 2026 17:47:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Jos sinulla ei ole suomalaista nimeä, voit unohtaa työnhaun.",
    type: "image",
    mediaUrl: "",
    username: "tottavai",
    firstName: "Oliver Juhani Lindberg",
    lastName: "",
    avatarURL: "/assets/users/TottaVai.png",
    createdAt: new Date("April 06 2026 18:46:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 0
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "If your name isn’t Finnish, good luck getting a job.",
    type: "image",
    mediaUrl: "",
    username: "tottavai",
    firstName: "Oliver Juhani Lindberg",
    lastName: "",
    avatarURL: "/assets/users/TottaVai.png",
    createdAt: new Date("April 06 2026 18:47:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Har du inte ett finskt namn kan du glömma jobbsökandet.",
    type: "image",
    mediaUrl: "",
    username: "tottavai",
    firstName: "Oliver Juhani Lindberg",
    lastName: "",
    avatarURL: "/assets/users/TottaVai.png",
    createdAt: new Date("April 06 2026 18:48:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 6
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Työvoimapula on myytti, jota käytetään painostamaan palkkoja.",
    type: "image",
    mediaUrl: "",
    username: "tottavai",
    firstName: "Oliver Juhani Lindberg",
    lastName: "",
    avatarURL: "/assets/users/TottaVai.png",
    createdAt: new Date("April 06 2026 19:46:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 2
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Unemployment isn’t about people. It’s about the system.",
    type: "image",
    mediaUrl: "",
    username: "tottavai",
    firstName: "Oliver Juhani Lindberg",
    lastName: "",
    avatarURL: "/assets/users/TottaVai.png",
    createdAt: new Date("April 06 2026 19:47:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 6
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Arbetslöshet handlar inte om människor utan om systemet.",
    type: "image",
    mediaUrl: "",
    username: "tottavai",
    firstName: "Oliver Juhani Lindberg",
    lastName: "",
    avatarURL: "/assets/users/TottaVai.png",
    createdAt: new Date("April 06 2026 19:48:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 5
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Kalbådagrundista ei ole hetkeen saatu tuulihavaintoja, sillä merimetso tykkää käydä istumassa tuulianturin puomilla ja vääntämässä tuuliviiriä. Myös talitiaset aiheuttavat ongelmia, sillä he yöpyvät lämmitetyssä tutkalähettimessä. Näin ollen öisin ei tule näkyvyyshavaintoja.",
    type: "image",
    mediaUrl: "",
    username: "meteorologit",
    firstName: "Ilmatieteen laitos",
    lastName: "",
    avatarURL: "/assets/users/meteorologit.png",
    createdAt: new Date("April 06 2026 06:56:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 766
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Suomen merialueilla on mitattu ensimmäistä kertaa mittaushistoriassa hirmumyrskyä (keskituuli vähintään 33 m/s). Rauman Kylmäpihlajalla keskituuli oli hetki sitten 33,5 m/s.",
    type: "image",
    mediaUrl: "/assets/posts/GbUniMYWwAEcAHH.jpeg",
    username: "meteorologit",
    firstName: "Ilmatieteen laitos",
    lastName: "",
    avatarURL: "/assets/users/meteorologit.png",
    createdAt: new Date("April 06 2026 19:05:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 746
    },
    comments: []
  }
];
