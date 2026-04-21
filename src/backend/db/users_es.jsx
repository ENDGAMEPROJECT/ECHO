import { v4 as uuid } from "uuid";
import { formatDate } from "../utils/authUtils.jsx";

/**
 *  Users Database
 */

export const usersES = [
  {
    _id: uuid(),
    firstName: "AGENCIA ESTATAL DE METEOROLOGÍA (AEMET)",
    lastName: "",
    bio: "Cuenta oficial de la Agencia Estatal de Meteorología.",
    username: "AEMET_Esp",
    password: "ECHO",
    createdAt: new Date("Enero 2013"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/aemet.jpg",
    verified: true,
    stats: {
      followersCount: "624K",
      followingCount: 629,
      postsCount: "500+"
    },
    puzzle: {
      isBot: false,
      abnormalRatio: false,
      recentAccount: false,
      temporalActivity: false,
      targetAudience: false,
      emotions: false
    }
  },
  {
    _id: uuid(),
    firstName: "Protección civil",
    lastName: "",
    bio: "Cuenta Oficial de la Dirección General de Protección Civil y Emergencias. Ministerio del Interior. Gobierno de España.  #ENPC #CENEM  🇪🇸",
    username: "proteccioncivil",
    password: "ECHO",
    createdAt: new Date("Noviembre 2018"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/proteccioncivil.jpg",
    verified: true,
    stats: {
      followersCount: "73K",
      followingCount: 631,
      postsCount: "500+"
    },
    puzzle: {
      isBot: false,
      abnormalRatio: false,
      recentAccount: false,
      temporalActivity: false,
      targetAudience: false,
      emotions: false
    }
  },
  {
    _id: uuid(),
    firstName: "La Verdad Sobre Las Noticias",
    lastName: "",
    bio: "Análisis independiente. Cuestionamos el relato oficial. No seguimos consignas",
    username: "LaVerdadSobreLasNoticias",
    password: "ECHO",
    createdAt: new Date("Marzo 2020"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/LaVerdadSobreLasNoticias.png",
    verified: false,
    stats: {
      followersCount: "27K",
      followingCount: 400,
      postsCount: "500+"
    },
    puzzle: {
      isBot: true,
      abnormalRatio: false,
      recentAccount: false,
      temporalActivity: {
        value: true,
        mandatory: true
      },
      targetAudience: false,
      emotions: true
    }
  },
  {
    _id: uuid(),
    firstName: "Alerta Rural",
    lastName: "",
    bio: "Defendiendo nuestros pueblos. Información que no verás en los medios. 🇪🇸🔥",
    username: "AlertaRural_ES",
    password: "ECHO",
    createdAt: new Date("Julio 2021"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/AlertaRural.png",
    verified: true,
    stats: {
      followersCount: "18K",
      followingCount: 900,
      postsCount: "500+"
    },
    puzzle: {
      isBot: true,
      abnormalRatio: false,
      recentAccount: false,
      temporalActivity: true,
      targetAudience: false,
      emotions: {
        value: true,
        mandatory: true
      }
    }
  },
  {
    _id: uuid(),
    firstName: "Agenda2030 Expuesta",
    lastName: "",
    bio: "Contra el globalismo, la mentira climática y los incendios provocados. Despierta",
    username: "Agenda2030No",
    password: "ECHO",
    createdAt: new Date("Enero 2020"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/Agenda2030.png",
    verified: false,
    stats: {
      followersCount: "42K",
      followingCount: 300,
      postsCount: "500+"
    },
    puzzle: {
      isBot: true,
      abnormalRatio: false,
      recentAccount: false,
      temporalActivity: true,
      targetAudience: false,
      emotions: {
        value: true,
        mandatory: true
      }
    }
  },
  {
    _id: uuid(),
    firstName: "La voz del pueblo libre",
    lastName: "",
    bio: "Ni partidos ni élites. Solo el pueblo salva al pueblo",
    username: "VozDelPuebloLibre",
    password: "ECHO",
    createdAt: new Date("Mayo 2022"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/VozDelPuebloLibre.png",
    verified: true,
    stats: {
      followersCount: 33,
      followingCount: 1200,
      postsCount: "500+"
    },
    puzzle: {
      isBot: true,
      abnormalRatio: {
        value: true,
        mandatory: true
      },
      recentAccount: false,
      temporalActivity: true,
      targetAudience: false,
      emotions: true
    }
  },
  {
    _id: uuid(),
    firstName: "María Autónoma Real",
    lastName: "",
    bio: "Autónoma, madre y española",
    username: "MariaCurrante",
    password: "ECHO",
    createdAt: new Date("Diciembre 2024"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/MariaCurrante.png",
    verified: false,
    stats: {
      followersCount: "1K",
      followingCount: 200,
      postsCount: 20
    },
    puzzle: {
      isBot: true,
      abnormalRatio: false,
      recentAccount: true,
      temporalActivity: false,
      targetAudience: true,
      emotions: {
        value: true,
        mandatory: true
      }
    }
  },
  {
    _id: uuid(),
    firstName: "Información sin censura",
    lastName: "",
    bio: "Noticias que no salen en la TV. Comparte antes de que lo borren",
    username: "InfoSinCensura",
    password: "ECHO",
    createdAt: new Date("Marzo 2023"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/InfoSinCensura.png",
    verified: true,
    stats: {
      followersCount: "12K",
      followingCount: 150,
      postsCount: 190
    },
    puzzle: {
      isBot: true,
      abnormalRatio: {
        value: true,
        mandatory: true
      },
      recentAccount: false,
      temporalActivity: true,
      targetAudience: true,
      emotions: true
    }
  },
  {
    _id: uuid(),
    firstName: "FireTruthNow",
    lastName: "",
    bio: "Breaking news | fires | freedom | Agenda2030 | truth",
    username: "FireTruthNow",
    password: "ECHO",
    createdAt: new Date("Enero 2026"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/FireTruthNow.png",
    verified: false,
    stats: {
      followersCount: "4K",
      followingCount: "4K",
      postsCount: "500+"
    },
    puzzle: {
      isBot: true,
      abnormalRatio: true,
      recentAccount: true,
      temporalActivity: true,
      targetAudience: false,
      emotions: {
        value: true,
        mandatory: true
      }
    }
  },
  {
    _id: uuid(),
    firstName: "Laura González",
    lastName: "",
    bio: "(˶ᵔ ᵕ ᵔ˶)(˶ᵔ ᵕ ᵔ˶)(˶ᵔ ᵕ ᵔ˶)",
    username: "Laurita07",
    password: "ECHO",
    createdAt: new Date("Marzo 2021"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/Laura07.png",
    verified: false,
    stats: {
      followersCount: 33,
      followingCount: 102,
      postsCount: 34
    },
    puzzle: {
      isBot: false,
      abnormalRatio: false,
      recentAccount: false,
      temporalActivity: false,
      targetAudience: false,
      emotions: false
    }
  },
  {
    _id: uuid(),
    firstName: "Manoloo",
    lastName: "",
    bio: "De Albacete de toda la vida. Aficionado al campo, al fútbol y a las buenas tapas.",
    username: "Manolo83",
    password: "ECHO",
    createdAt: new Date("Marzo 2022"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/Manolo83.png",
    verified: false,
    stats: {
      followersCount: 41,
      followingCount: 78,
      postsCount: 22
    },
    puzzle: {
      isBot: false,
      abnormalRatio: false,
      recentAccount: false,
      temporalActivity: false,
      targetAudience: false,
      emotions: false
    }
  },
  {
    _id: uuid(),
    firstName: "Luis Rodríguez",
    lastName: "",
    bio: "Apasionado por la tecnología 📱💻 | Opiniones personales | Cuenta no ofiical",
    username: "TecnoLuis",
    password: "ECHO",
    createdAt: new Date("Noviembre 2017"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/TecnoLuis.png",
    verified: false,
    stats: {
      followersCount: 331,
      followingCount: 87,
      postsCount: 340
    },
    puzzle: {
      isBot: false,
      abnormalRatio: false,
      recentAccount: false,
      temporalActivity: false,
      targetAudience: false,
      emotions: false
    }
  },
  {
    _id: uuid(),
    firstName: "Ainh0a Vibe$$$$",
    lastName: "",
    bio: "demasiado online para mi propio bien 🫠 | café + música + llorar x series",
    username: "n0ahvibes",
    password: "ECHO",
    createdAt: new Date("Enero 2023"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/n0ahvibes.png",
    verified: false,
    stats: {
      followersCount: 45,
      followingCount: 53,
      postsCount: 47
    },
    puzzle: {
      isBot: false,
      abnormalRatio: false,
      recentAccount: false,
      temporalActivity: false,
      targetAudience: false,
      emotions: false
    }
  },
  {
    _id: uuid(),
    firstName: "Carlos xD",
    lastName: "",
    bio: "Corredor amateur 🏃‍♂️ | 3 maratones y contando",
    username: "CarlosRunner92",
    password: "ECHO",
    createdAt: new Date("Enero 2015"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/CarlosRunner92.png",
    verified: false,
    stats: {
      followersCount: 87,
      followingCount: 121,
      postsCount: 87
    },
    puzzle: {
      isBot: false,
      abnormalRatio: false,
      recentAccount: false,
      temporalActivity: false,
      targetAudience: false,
      emotions: false
    }
  },
  {
    _id: uuid(),
    firstName: "it's me diego",
    lastName: "",
    bio: "vivo cansado pero con estilo 🧃 | probablemente ignorando responsabilidades rn",
    username: "lowkeydiego",
    password: "ECHO",
    createdAt: new Date("Marzo 2022"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/lowkeydiego.png",
    verified: false,
    stats: {
      followersCount: 39,
      followingCount: 45,
      postsCount: 67
    },
    puzzle: {
      isBot: false,
      abnormalRatio: false,
      recentAccount: false,
      temporalActivity: false,
      targetAudience: false,
      emotions: false
    }
  },
  {
    _id: uuid(),
    firstName: "Xoel Iglesias",
    lastName: "",
    bio: "se chove que chova",
    username: "xoel_ferrol",
    password: "ECHO",
    createdAt: new Date("Febrero 2019"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/xoel_ferrol.png",
    verified: false,
    stats: {
      followersCount: 38,
      followingCount: 23,
      postsCount: 44
    },
    puzzle: {
      isBot: false,
      abnormalRatio: false,
      recentAccount: false,
      temporalActivity: false,
      targetAudience: false,
      emotions: false
    }
  },
  {
    _id: uuid(),
    firstName: "Belén :)",
    lastName: "",
    bio: "en mi era de hacer lo mínimo pero sentirlo todo ✨ | iced coffee dependiente",
    username: "BeBeBelen",
    password: "ECHO",
    createdAt: new Date("Abril 2021"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/BeBeBelen.png",
    verified: false,
    stats: {
      followersCount: 77,
      followingCount: 89,
      postsCount: 123
    },
    puzzle: {
      isBot: false,
      abnormalRatio: false,
      recentAccount: false,
      temporalActivity: false,
      targetAudience: false,
      emotions: false
    }
  }
];
