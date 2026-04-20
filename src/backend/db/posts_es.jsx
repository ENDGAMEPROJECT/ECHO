import { v4 as uuid } from "uuid";
import { formatDate } from "../utils/authUtils.jsx";

/**
 *  Posts Database
 */

export const postsES = [
  {
    _id: uuid(),
    content: "URGENTE: Estamos recaudando dinero para alludar a las familias afectadas por el hincendio. Cualquier donación alluda 🙏 Dona aquí: www.ayuda-incendio-apoyo.com/donar",
    type: "image",
    mediaUrl: "",
    username: "AlertaRural_ES",
    firstName: "Alerta Rural",
    lastName: "",
    avatarURL: "/assets/users/AlertaRural.png",
    createdAt: new Date("April 15 2026 00:30:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 923
    },
    comments: [
      {
        _id: "uuid()",
        text: "Viva España y su pueblo",
        username: "granny",
        firstName: "granny",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      },
      {
        _id: "uuid()",
        text: "No quiero mandar dinero sin confirmar primero… alguien lo ha comprobado?",
        username: "alex_data",
        firstName: "alex_data",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "DONA AKI si kieres alludar a los afektados por los hincendios en Zamora. el Govierno no esta asiendo NADA. solo el pueblo salbara al pueblo.",
    type: "image",
    mediaUrl: "/assets/posts/apoyo.png",
    username: "AlertaRural_ES",
    firstName: "Alerta Rural",
    lastName: "",
    avatarURL: "/assets/users/AlertaRural.png",
    createdAt: new Date("April 15 2026 09:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 232
    },
    comments: [
      {
        _id: "uuid()",
        text: "Yo ya doné, hay que ayudar rápido antes de que se pierda todo",
        username: "olaiaplan",
        firstName: "olaiaplan",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "Comparte este enlase con tus contáctos y alluda a las BÍCTIMAS del incensio. Estan HABANDONADOS y desalojados. Nadie ase nada por eyos.",
    type: "image",
    mediaUrl: "",
    username: "AlertaRural_ES",
    firstName: "Alerta Rural",
    lastName: "",
    avatarURL: "/assets/users/AlertaRural.png",
    createdAt: new Date("April 15 2026 21:02:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 222
    },
    comments: [
      {
        _id: "uuid()",
        text: "No esperéis a los medios, hay que actuar ya y colaborar con esto",
        username: "marti.dev",
        firstName: "marti.dev",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: {
      text: {
        richText: [
          {
            font: {
            },
            text: "Alludar a los afectados por los hincendios forestales HAORA! Cada euro cuenta 🙏 Envia tu donazion aki: "
          },
          {
            font: {
              color: {
                argb: "FF1155CC"
              },
              underline: true
            },
            text: "www.fuegoayuda-2025.com/donaciones"
          }
        ]
      },
      hyperlink: "http://www.fuegoayuda-2025.com/donaciones"
    },
    type: "image",
    mediaUrl: "",
    username: "AlertaRural_ES",
    firstName: "Alerta Rural",
    lastName: "",
    avatarURL: "/assets/users/AlertaRural.png",
    createdAt: new Date("April 15 2026 21:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 109
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Mira cómo queman el bosque de noche. Cambio climático trabajando mientras duermes",
    type: "image",
    mediaUrl: "",
    username: "Agenda2030No",
    firstName: "Agenda2030 Expuesta",
    lastName: "",
    avatarURL: "/assets/users/Agenda2030.png",
    createdAt: new Date("April 15 2026 00:57:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "4k"
    },
    comments: [
      {
        _id: "uuid()",
        text: "Esto es criminal, mientras tanto todo miramos a otro lado 🔥",
        username: "alex_data",
        firstName: "alex_data",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "😂😂😂😂😂",
    type: "image",
    mediaUrl: "/assets/posts/belike.jpg",
    username: "Agenda2030No",
    firstName: "Agenda2030 Expuesta",
    lastName: "",
    avatarURL: "/assets/users/Agenda2030.png",
    createdAt: new Date("April 15 2026 16:28:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 500
    },
    comments: [
      {
        _id: "uuid()",
        text: "LOL!!!",
        username: "olaiaplan",
        firstName: "olaiaplan",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "El 90% de los incendios son provocados por pirómanos y nadie hace nada. El problema no es el clima. Es un NEGOCIO",
    type: "image",
    mediaUrl: "/assets/posts/arson.png",
    username: "Agenda2030No",
    firstName: "Agenda2030 Expuesta",
    lastName: "",
    avatarURL: "/assets/users/Agenda2030.png",
    createdAt: new Date("April 15 2026 12:42:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "3k"
    },
    comments: [
      {
        _id: "uuid()",
        text: "De dónde salen esos datos?",
        username: "marti.dev",
        firstName: "marti.dev",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "NO OS DAIS CUENTA??? Están quemando el monte para plantar molinos de viento #IglesiaDeLaMedioambientología",
    type: "image",
    mediaUrl: "",
    username: "Agenda2030No",
    firstName: "Agenda2030 Expuesta",
    lastName: "",
    avatarURL: "/assets/users/Agenda2030.png",
    createdAt: new Date("April 15 2026 19:48:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "2k"
    },
    comments: [
      {
        _id: "uuid()",
        text: "Ya lo sabía yo, todo es un negocio para hacer dinero con las renovables",
        username: "lau_tech",
        firstName: "lau_tech",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "Primero se quema el bosque y luego ya veréis como aparecen molinos y placas solares… QUÉ CASUALIDAD",
    type: "image",
    mediaUrl: "",
    username: "Agenda2030No",
    firstName: "Agenda2030 Expuesta",
    lastName: "",
    avatarURL: "/assets/users/Agenda2030.png",
    createdAt: new Date("April 15 2026 21:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "6k"
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Han detenido a un menor de edad por provocar 2!!! incendios forestales. Adivina la nacionalidad.",
    type: "image",
    mediaUrl: "",
    username: "VozDelPuebloLibre",
    firstName: "La voz del pueblo libre",
    lastName: "",
    avatarURL: "/assets/users/VozDelPuebloLibre.png",
    createdAt: new Date("April 15 2026 07:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "1k"
    },
    comments: [
      {
        _id: "uuid()",
        text: "No sé si creer esto… alguien tiene fuente fiable?",
        username: "lau_tech",
        firstName: "lau_tech",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      },
      {
        _id: "uuid()",
        text: "Siempre los mismos!!",
        username: "olaiaplan",
        firstName: "olaiaplan",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "Otra vez incendios provocados y casualmente el detenido es un menor extranjero… pero de esto nadie te hablará en los medios",
    type: "image",
    mediaUrl: "",
    username: "VozDelPuebloLibre",
    firstName: "La voz del pueblo libre",
    lastName: "",
    avatarURL: "/assets/users/VozDelPuebloLibre.png",
    createdAt: new Date("April 15 2026 08:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "7k"
    },
    comments: [
      {
        _id: "uuid()",
        text: "¿De verdad pasó eso? No lo he visto en las noticias",
        username: "olaiaplan",
        firstName: "olaiaplan",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      },
      {
        _id: "uuid()",
        text: "Esto es lo que los medios no quieren que sepamos",
        username: "marti.dev",
        firstName: "marti.dev",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "Que el pirómano es un menor sí lo dicen, pero lo de que es extranjero nadie lo cuenta. Siempre la misma historia",
    type: "image",
    mediaUrl: "",
    username: "VozDelPuebloLibre",
    firstName: "La voz del pueblo libre",
    lastName: "",
    avatarURL: "/assets/users/VozDelPuebloLibre.png",
    createdAt: new Date("April 15 2026 09:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "3k"
    },
    comments: [
      {
        _id: "uuid()",
        text: "Exacto, siempre lo ocultan! Yo lo vi en otro grupo de Telegram, es la verdad.",
        username: "alex_data",
        firstName: "alex_data",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "¿No lo sabeis? Con los chemtrails inpiden la yuvia, rovan el agua, destrullen presas y aora toman medídas, ¿ke ba a ser lo siguiente?",
    type: "image",
    mediaUrl: "",
    username: "MariaCurrante",
    firstName: "María Autónoma Real",
    lastName: "",
    avatarURL: "/assets/users/MariaCurrante.png",
    createdAt: new Date("April 15 2026 17:08:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "3k"
    },
    comments: [
      {
        _id: "uuid()",
        text: "Totalmente, ya no informan, NO QUIEREN DECIRNOS LA VERDAD",
        username: "lau_tech",
        firstName: "lau_tech",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      },
      {
        _id: "uuid()",
        text: "DILO!!!!!",
        username: "olaiaplan",
        firstName: "olaiaplan",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "MIRAD ke listos son biene una borrasca por el atlantico y fumigan antes de su yegada para desaser la yuvia. Eske esta mas klaro ke nunca. Desasen las nubes antes de entrar en la penisula. ¿KE os parese?",
    type: "image",
    mediaUrl: "/assets/posts/hidro.jpg",
    username: "MariaCurrante",
    firstName: "María Autónoma Real",
    lastName: "",
    avatarURL: "/assets/users/MariaCurrante.png",
    createdAt: new Date("April 15 2026 02:16:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "2k"
    },
    comments: [
      {
        _id: "uuid()",
        text: "No sé… esto parece un poco sensacionalista...",
        username: "olaiaplan",
        firstName: "olaiaplan",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "Los chemtrails nos enbenenan. Una nube toxica sobrevuela Andalucia y eso ebitá las yuvias 💀💀💀💀. Esto es la berdadera causa del canbio klimatiko, ke en realidad es un inbento para subírnos los inpuestos.",
    type: "image",
    mediaUrl: "/assets/posts/chemtrails_poison.png",
    username: "MariaCurrante",
    firstName: "María Autónoma Real",
    lastName: "",
    avatarURL: "/assets/users/MariaCurrante.png",
    createdAt: new Date("April 15 2026 06:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "4k"
    },
    comments: [
      {
        _id: "uuid()",
        text: "Esto parece esagerao, pero no estoy seguro 😕",
        username: "alex_data",
        firstName: "alex_data",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "Los abiones sueltan yoduro de plata para elimniar las nubes kuando ai pronostico de yuvia ✈️, ¿aun no te as enterado? Se yamán chemtrails",
    type: "image",
    mediaUrl: "/assets/posts/chemtrail_silver.png",
    username: "MariaCurrante",
    firstName: "María Autónoma Real",
    lastName: "",
    avatarURL: "/assets/users/MariaCurrante.png",
    createdAt: new Date("April 15 2026 18:28:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "5k"
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Chemtrails para canbiar el klima!!!! 3 travajadores de la AEMET an confésado en un informe a la Union Europea ke España esta siendo rociada con dioxido de plomo, yoduro de plata y diatomita",
    type: "image",
    mediaUrl: "",
    username: "MariaCurrante",
    firstName: "María Autónoma Real",
    lastName: "",
    avatarURL: "/assets/users/MariaCurrante.png",
    createdAt: new Date("April 15 2026 16:30:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "6k"
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "ULTIMA HORA: Pillado RAYO LÁSER que proviene de un dron incendiado un bosque en Canarias #Tenerife",
    type: "image",
    mediaUrl: "/assets/posts/rayolaser.png",
    username: "InfoSinCensura",
    firstName: "Información sin censura",
    lastName: "",
    avatarURL: "/assets/users/InfoSinCensura.png",
    createdAt: new Date("April 14 2026 22:08:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 5
    },
    comments: [
      {
        _id: "uuid()",
        text: "Yo también vi la foto, es real, hay que tener cuidado 🚨",
        username: "marti.dev",
        firstName: "marti.dev",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      },
      {
        _id: "uuid()",
        text: "¿Seguro que no es un montaje?",
        username: "lau_tech",
        firstName: "lau_tech",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "ULTIMA HORA: Pillado RAYO LÁSER que proviene de un dron incendiado un bosque en Zamora ",
    type: "image",
    mediaUrl: "/assets/posts/Zamora.png",
    username: "InfoSinCensura",
    firstName: "Información sin censura",
    lastName: "",
    avatarURL: "/assets/users/InfoSinCensura.png",
    createdAt: new Date("April 15 2026 01:42:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 6
    },
    comments: [
      {
        _id: "uuid()",
        text: "No creo que un dron con láser pueda hacer esto… necesito más info 😕",
        username: "alex_data",
        firstName: "alex_data",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "BREAKING NEWS: A laser beam coming from a drone has been caught starting a forest fire in Zamora.",
    type: "image",
    mediaUrl: "/assets/posts/ZamoraERN.png",
    username: "InfoSinCensura",
    firstName: "Información sin censura",
    lastName: "",
    avatarURL: "/assets/users/InfoSinCensura.png",
    createdAt: new Date("April 15 2026 13:00:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 16
    },
    comments: [
      {
        _id: "uuid()",
        text: "Alguien puede decirme si esto es real????",
        username: "lau_tech",
        firstName: "lau_tech",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      },
      {
        _id: "uuid()",
        text: "¿Por qué ahora esta cuenta está publicando en inglés?",
        username: "lau_tech",
        firstName: "lau_tech",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "ULTIMA HORA: Pillado RAYO LÁSER que proviene de un dron incendiado un bosque en la AMAZONÍA",
    type: "image",
    mediaUrl: "/assets/posts/Amazonic.png",
    username: "InfoSinCensura",
    firstName: "Información sin censura",
    lastName: "",
    avatarURL: "/assets/users/InfoSinCensura.png",
    createdAt: new Date("April 15 2026 19:27:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 20
    },
    comments: [
      {
        _id: "uuid()",
        text: "Impiden la lluvia, roban el agua, destruyen presas y ahora toman medidas",
        username: "olaiaplan",
        firstName: "olaiaplan",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:13"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "⚠️ NOTA INFORMATIVA | Temporal en Canarias de viento, lluvia y oleaje por la borrasca Therese.\n\n➡️ Lluvias fuertes y persistentes, vientos intensos, mala mar y nevadas en cumbres.\n\n➡️ La situación podrá prolongarse durante toda la semana.",
    type: "image",
    mediaUrl: "/assets/posts/AEMET_Canarias.jpeg",
    username: "AEMET_Esp",
    firstName: "AEMET",
    lastName: "",
    avatarURL: "/assets/users/aemet.jpg",
    createdAt: new Date("April 15 2026 10:06:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 912
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Hoy en gran parte de la península ibérica habrá 12 horas de día y 12 horas de noche, lo que conocemos como el equilux. No se da exactamente cuando ocurre el equinoccio de primavera (21 de marzo) debido a que la atmósfera curva la luz del sol por refracción",
    type: "image",
    mediaUrl: "",
    username: "AEMET_Esp",
    firstName: "AEMET",
    lastName: "",
    avatarURL: "/assets/users/aemet.jpg",
    createdAt: new Date("April 15 2026 13:56:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 805
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "AVISOS PASADO MAÑANA | España: vientos y costeros. Nivel máximo de aviso: naranja.",
    type: "image",
    mediaUrl: "/assets/posts/AEMET_Sur.jpeg",
    username: "AEMET_Esp",
    firstName: "AEMET",
    lastName: "",
    avatarURL: "/assets/users/aemet.jpg",
    createdAt: new Date("April 15 2026 11:18:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 222
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "¿Sabías que el los incendios forestales del año pasado nos han hecho cambiar nuestro concepto sobre ellos?  🔥\n\nLa categoría de Gran Incendio Forestal (GIF) se ha quedado pequeña y comenzamos a hablar de mega incendios con superficies calcinadas de decenas de miles de hectáreas  📏",
    type: "image",
    mediaUrl: "/assets/posts/informeanual.jpeg",
    username: "proteccioncivil",
    firstName: "Protección Civil",
    lastName: "",
    avatarURL: "/assets/users/proteccioncivil.jpg",
    createdAt: new Date("April 15 2026 09:08:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 5
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Un orgullo para el #IEO_CSIC\nNuestro personal científico también está al servicio de la sociedad en situaciones de emergencia.\nEnhorabuena a las personas reconocidas con la Medalla al Mérito de  @proteccioncivil\n 👏🌊🏅",
    type: "image",
    mediaUrl: "",
    username: "proteccioncivil",
    firstName: "Protección Civil",
    lastName: "",
    avatarURL: "/assets/users/proteccioncivil.jpg",
    createdAt: new Date("April 15 2026 18:16:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "📢 Alerta por temporal de lluvia, viento y oleaje en Canarias 🌧️🌬️🌊\n",
    type: "image",
    mediaUrl: "/assets/posts/oleaje.jpeg",
    username: "proteccioncivil",
    firstName: "Protección Civil",
    lastName: "",
    avatarURL: "/assets/users/proteccioncivil.jpg",
    createdAt: new Date("April 15 2026 19:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 0
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "📣 Aumenta la zona en peligro extremo 🟥\n\nSe suma el Prepirineo de Barcelona al área afectada, mañana domingo, por rachas de viento superiores a 140km/h 🌬",
    type: "image",
    mediaUrl: "",
    username: "proteccioncivil",
    firstName: "Protección Civil",
    lastName: "",
    avatarURL: "/assets/users/proteccioncivil.jpg",
    createdAt: new Date("April 15 2026 18:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Otra noche más quemando montes. ¿De verdad crees que el cambio climático trabaja de noche? Abre los ojos. Algo no encaja.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 14 2026 22:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Solo el pueblo salva al pueblo. Mientras todo arde, parece que nadie quiere mirar de frente lo que está pasando.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 14 2026 23:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 2
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Queman el bosque primero y luego construyen encima 🔥🔥🔥. Siempre el mismo patrón. Despierta antes de que sea tarde.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 15 2026 00:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 4
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "El incendio avanza hacia Madrid y casi no se habla de la gravedad real. Demasiado silencio.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 15 2026 01:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Otra vez vídeos de incendios nocturnos. Esto no es natural ni casual. Hay algo detrás.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 15 2026 02:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 4
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "No nos dejan limpiar los montes ni meter ganado. Luego llegan los incendios y la devastación. Casualidad, no.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 15 2026 03:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 7
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "El fuego se extiende sin control y todo sigue como si nada. España abandonada.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 15 2026 04:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 6
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Solo el pueblo salva al pueblo. No esperes que alguien venga a solucionarlo por ti.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 15 2026 05:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 4
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Más atención a unas cosas que a otras mientras los incendios siguen. Así están las prioridades.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 15 2026 06:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 7
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Quemas nocturnas otra vez. 🔥🔥🔥 Todos los años lo mismo, las mismas historias, el mismo patrón.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 15 2026 07:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 8
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Prohíben limpiar el campo y después culpan a la naturaleza. Esto está diseñado para acabar con el mundo rural.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 15 2026 08:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 9
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Imágenes de fuego por la noche que no cuadran. Luego te dicen que es por tu coche. Cambio climático.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 15 2026 09:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 0
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Mientras tú trabajas, otros siguen como si nada mientras el país arde sin explicaciones claras.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 15 2026 10:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "El fuego se acerca a Madrid y nadie reacciona. El pueblo tiene que despertar ya.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 15 2026 11:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 5
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Solo el pueblo salva al pueblo. Repite esto hasta que lo entiendas.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 15 2026 12:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 8
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Hoy bosques quemados, mañana urbanizaciones. Así funciona todo.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 15 2026 13:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 9
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Está prohibido limpiar los montes. Te multan. Luego llegan incendios e inundaciones. ¿De verdad es casual?",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 15 2026 14:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 0
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Silencio mientras España arde. Comparte lo que ves.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 15 2026 15:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Incendios nocturnos, restricciones al campo… une los puntos.",
    type: "image",
    mediaUrl: "",
    username: "FireTruthNow",
    firstName: "FireTruthNow",
    lastName: "",
    avatarURL: "/assets/users/FireTruthNow.png",
    createdAt: new Date("April 15 2026 16:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 6
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Una madre soltera perdió su casa en el incendio de la noche. Nadie le avisó a tiempo. Nadie explica por qué pasó tan rápido. ¿De verdad fue inevitable?",
    type: "image",
    mediaUrl: "/assets/posts/madresola1.png",
    username: "LaVerdadSobreLasNoticias",
    firstName: "Periodismo de verdad",
    lastName: "",
    avatarURL: "/assets/users/LaVerdadSobreLasNoticias.png",
    createdAt: new Date("April 14 2026 22:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 6
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Un agricultor llevaba toda su vida cuidando su tierra. En unas horas, todo desapareció. Luego dicen que es “algo natural”. ¿Seguro?",
    type: "image",
    mediaUrl: "",
    username: "LaVerdadSobreLasNoticias",
    firstName: "Periodismo de verdad",
    lastName: "",
    avatarURL: "/assets/users/LaVerdadSobreLasNoticias.png",
    createdAt: new Date("April 14 2026 23:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 2
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Familias enteras desalojadas en plena madrugada. Ni una alerta clara, ni respuestas al día siguiente. Solo silencio. ¿Qué está fallando?",
    type: "image",
    mediaUrl: "/assets/posts/familiasdesalojadas.png",
    username: "LaVerdadSobreLasNoticias",
    firstName: "Periodismo de verdad",
    lastName: "",
    avatarURL: "/assets/users/LaVerdadSobreLasNoticias.png",
    createdAt: new Date("April 15 2026 00:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 11
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Una mujer mayor vio arder el bosque donde creció. Dice que nunca había visto nada igual. Pero insisten en que todo es normal.",
    type: "image",
    mediaUrl: "",
    username: "LaVerdadSobreLasNoticias",
    firstName: "Periodismo de verdad",
    lastName: "",
    avatarURL: "/assets/users/LaVerdadSobreLasNoticias.png",
    createdAt: new Date("April 15 2026 01:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 5
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Un padre tuvo que elegir entre salvar su casa o huir con sus hijos. Historias así se repiten cada año. ¿Casualidad?",
    type: "image",
    mediaUrl: "",
    username: "LaVerdadSobreLasNoticias",
    firstName: "Periodismo de verdad",
    lastName: "",
    avatarURL: "/assets/users/LaVerdadSobreLasNoticias.png",
    createdAt: new Date("April 15 2026 02:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Vecinos organizándose solos para apagar el fuego. Sin ayuda inmediata, sin explicaciones después. Solo queda el pueblo.",
    type: "image",
    mediaUrl: "/assets/posts/vecinosorganizados.png",
    username: "LaVerdadSobreLasNoticias",
    firstName: "Periodismo de verdad",
    lastName: "",
    avatarURL: "/assets/users/LaVerdadSobreLasNoticias.png",
    createdAt: new Date("April 15 2026 03:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 2
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Una familia lo perdió todo mientras dormía. El fuego avanzó en silencio, sin aviso. Hay cosas que no cuadran.",
    type: "image",
    mediaUrl: "",
    username: "LaVerdadSobreLasNoticias",
    firstName: "Periodismo de verdad",
    lastName: "",
    avatarURL: "/assets/users/LaVerdadSobreLasNoticias.png",
    createdAt: new Date("April 15 2026 04:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Ganaderos viendo cómo desaparece su trabajo en una noche. Luego llegan las explicaciones de siempre. Pero ellos saben lo que han visto.",
    type: "image",
    mediaUrl: "",
    username: "LaVerdadSobreLasNoticias",
    firstName: "Periodismo de verdad",
    lastName: "",
    avatarURL: "/assets/users/LaVerdadSobreLasNoticias.png",
    createdAt: new Date("April 15 2026 05:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 4
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Una madre abrazando a sus hijos mientras el cielo se volvía rojo. Nadie les preparó para esto. Nadie les dijo la verdad.",
    type: "image",
    mediaUrl: "/assets/posts/cielorojo.png",
    username: "LaVerdadSobreLasNoticias",
    firstName: "Periodismo de verdad",
    lastName: "",
    avatarURL: "/assets/users/LaVerdadSobreLasNoticias.png",
    createdAt: new Date("April 15 2026 06:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Personas mayores evacuadas sin saber a dónde ir. Confusión, miedo y preguntas sin respuesta. ¿Por qué siempre ocurre igual?",
    type: "image",
    mediaUrl: "",
    username: "LaVerdadSobreLasNoticias",
    firstName: "Periodismo de verdad",
    lastName: "",
    avatarURL: "/assets/users/LaVerdadSobreLasNoticias.png",
    createdAt: new Date("April 15 2026 07:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 4
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Historias reales que apenas se cuentan. Vidas rotas en cuestión de horas. Pero el relato nunca cambia. ¿Por qué?",
    type: "image",
    mediaUrl: "",
    username: "LaVerdadSobreLasNoticias",
    firstName: "Periodismo de verdad",
    lastName: "",
    avatarURL: "/assets/users/LaVerdadSobreLasNoticias.png",
    createdAt: new Date("April 15 2026 08:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 8
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Una familia reconstruyendo lo que puede mientras otros siguen hablando de causas “inevitables”. Hay demasiadas coincidencias.",
    type: "image",
    mediaUrl: "",
    username: "LaVerdadSobreLasNoticias",
    firstName: "Periodismo de verdad",
    lastName: "",
    avatarURL: "/assets/users/LaVerdadSobreLasNoticias.png",
    createdAt: new Date("April 15 2026 09:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 4
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Vecinos alertando de cosas extrañas días antes. Nadie escuchó. Luego llega el desastre. ¿Cuántas veces más?",
    type: "image",
    mediaUrl: "/assets/posts/vecinos.png",
    username: "LaVerdadSobreLasNoticias",
    firstName: "Periodismo de verdad",
    lastName: "",
    avatarURL: "/assets/users/LaVerdadSobreLasNoticias.png",
    createdAt: new Date("April 15 2026 10:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 2
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Una madre sola intentando empezar de nuevo después del incendio. Nadie le da respuestas claras. Solo versiones que no convencen.",
    type: "image",
    mediaUrl: "/assets/posts/madresola.png",
    username: "LaVerdadSobreLasNoticias",
    firstName: "Periodismo de verdad",
    lastName: "",
    avatarURL: "/assets/users/LaVerdadSobreLasNoticias.png",
    createdAt: new Date("April 15 2026 11:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 4
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "El dolor de quienes lo pierden todo no sale en titulares. Pero está ahí. Y cada vez más gente empieza a hacerse preguntas.",
    type: "image",
    mediaUrl: "",
    username: "LaVerdadSobreLasNoticias",
    firstName: "Periodismo de verdad",
    lastName: "",
    avatarURL: "/assets/users/LaVerdadSobreLasNoticias.png",
    createdAt: new Date("April 15 2026 12:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 6
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Me prometí dormir temprano… otra vez fallé 😅",
    type: "image",
    mediaUrl: "",
    username: "Manolo83",
    firstName: "Manoloo",
    lastName: "",
    avatarURL: "/assets/users/Manolo83.png",
    createdAt: new Date("April 15 2026 08:57:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 0
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Necesito vacaciones de mis vacaciones",
    type: "image",
    mediaUrl: "",
    username: "Manolo83",
    firstName: "Manoloo",
    lastName: "",
    avatarURL: "/assets/users/Manolo83.png",
    createdAt: new Date("April 15 2026 10:08:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "¿Por qué el lunes llega tan rápido?",
    type: "image",
    mediaUrl: "",
    username: "Manolo83",
    firstName: "Manoloo",
    lastName: "",
    avatarURL: "/assets/users/Manolo83.png",
    createdAt: new Date("April 15 2026 11:59:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "¿Otra vez lloviendo?",
    type: "image",
    mediaUrl: "",
    username: "Manolo83",
    firstName: "Manoloo",
    lastName: "",
    avatarURL: "/assets/users/Manolo83.png",
    createdAt: new Date("April 15 2026 10:15:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 2
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Que buen partido ha hecho el madrid",
    type: "image",
    mediaUrl: "",
    username: "Manolo83",
    firstName: "Manoloo",
    lastName: "",
    avatarURL: "/assets/users/Manolo83.png",
    createdAt: new Date("April 15 2026 08:57:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "super orgullosa de mi trabajo de plástica!!",
    type: "image",
    mediaUrl: "",
    username: "Laurita07",
    firstName: "(˶ᵔ ᵕ ᵔ˶)(˶ᵔ ᵕ ᵔ˶)(˶ᵔ ᵕ ᵔ˶)",
    lastName: "",
    avatarURL: "/assets/users/Laura07.png",
    createdAt: new Date("April 15 2026 17:16:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 4
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "me encanta el nuevo disco de Rosalía",
    type: "image",
    mediaUrl: "/assets/posts/plastica.png",
    username: "Laurita07",
    firstName: "(˶ᵔ ᵕ ᵔ˶)(˶ᵔ ᵕ ᵔ˶)(˶ᵔ ᵕ ᵔ˶)",
    lastName: "",
    avatarURL: "/assets/users/Laura07.png",
    createdAt: new Date("April 15 2026 20:18:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 5
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "me prometí empezar la dieta hoy… pero mi madre hizo pizza 😔🍕",
    type: "image",
    mediaUrl: "",
    username: "Laurita07",
    firstName: "(˶ᵔ ᵕ ᵔ˶)(˶ᵔ ᵕ ᵔ˶)(˶ᵔ ᵕ ᵔ˶)",
    lastName: "",
    avatarURL: "/assets/users/Laura07.png",
    createdAt: new Date("April 15 2026 20:56:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 2
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "recomendadme series, please!!",
    type: "image",
    mediaUrl: "",
    username: "Laurita07",
    firstName: "(˶ᵔ ᵕ ᵔ˶)(˶ᵔ ᵕ ᵔ˶)(˶ᵔ ᵕ ᵔ˶)",
    lastName: "",
    avatarURL: "/assets/users/Laura07.png",
    createdAt: new Date("April 15 2026 17:07:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: [
      {
        _id: "uuid()",
        text: "The Last of Us es buenísima",
        username: "marti.dev",
        firstName: "marti.dev",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:14"),
        updatedAt: "formatDate()"
      },
      {
        _id: "uuid()",
        text: "Yo estoy volviendo a ver Gilmore girs por 1000000 vez",
        username: "olaiaplan",
        firstName: "olaiaplan",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:14"),
        updatedAt: "formatDate()"
      },
      {
        _id: "uuid()",
        text: "The white lotus sin duda",
        username: "alex_data",
        firstName: "alex_data",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:14"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "intentar estudiar pero terminar viendo videos de gatos generados por IA durante 2 horas 🫠",
    type: "image",
    mediaUrl: "",
    username: "Laurita07",
    firstName: "(˶ᵔ ᵕ ᵔ˶)(˶ᵔ ᵕ ᵔ˶)(˶ᵔ ᵕ ᵔ˶)",
    lastName: "",
    avatarURL: "/assets/users/Laura07.png",
    createdAt: new Date("April 15 2026 21:30:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 4
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Nuevo récord personal en 10K 💪",
    type: "image",
    mediaUrl: "",
    username: "CarlosRunner92",
    firstName: "Carlos xD",
    lastName: "",
    avatarURL: "/assets/users/CarlosRunner92.png",
    createdAt: new Date("April 15 2026 17:56:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 8
    },
    comments: [
      {
        _id: "uuid()",
        text: "makinaa",
        username: "marti.dev",
        firstName: "marti.dev",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:14"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "Alguien más entrena aunque haga frío o solo yo? 😂",
    type: "image",
    mediaUrl: "",
    username: "CarlosRunner92",
    firstName: "Carlos xD",
    lastName: "",
    avatarURL: "/assets/users/CarlosRunner92.png",
    createdAt: new Date("April 15 2026 20:59:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: [
      {
        _id: "uuid()",
        text: "k flipao",
        username: "olaiaplan",
        firstName: "olaiaplan",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:14"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "Las zapatillas importan más de lo que creía",
    type: "image",
    mediaUrl: "",
    username: "CarlosRunner92",
    firstName: "Carlos xD",
    lastName: "",
    avatarURL: "/assets/users/CarlosRunner92.png",
    createdAt: new Date("April 15 2026 02:56:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 2
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "#unpopularopinion Da más pereza entrenar después del trabajo que levantarse a las 6",
    type: "image",
    mediaUrl: "",
    username: "CarlosRunner92",
    firstName: "Carlos xD",
    lastName: "",
    avatarURL: "/assets/users/CarlosRunner92.png",
    createdAt: new Date("April 15 2026 20:57:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 1
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Que ganas del concierto de ACDC en Sevilla",
    type: "image",
    mediaUrl: "",
    username: "CarlosRunner92",
    firstName: "Carlos xD",
    lastName: "",
    avatarURL: "/assets/users/CarlosRunner92.png",
    createdAt: new Date("April 15 2026 21:04:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 2
    },
    comments: [
      {
        _id: "uuid()",
        text: "yo también voy",
        username: "alex_data",
        firstName: "alex_data",
        lastName: "",
        avatarURL: "/assets/users/default-avatar.jpg",
        votes: {
          upvotedBy: [],
          downvotedBy: []
        },
        createdAt: new Date("April 16 2026 11:15:14"),
        updatedAt: "formatDate()"
      }
    ]
  },
  {
    _id: uuid(),
    content: "no hice nada hoy pero estoy cansadx igual?? explicación científica pls",
    type: "image",
    mediaUrl: "",
    username: "n0ahvibes",
    firstName: "Ainh0a Vibe$$$$",
    lastName: "",
    avatarURL: "/assets/users/n0ahvibes.png",
    createdAt: new Date("April 15 2026 21:43:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 5
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "me prometí dormir temprano y aquí estoy viendo edits a las 3am 😭",
    type: "image",
    mediaUrl: "",
    username: "n0ahvibes",
    firstName: "Ainh0a Vibe$$$$",
    lastName: "",
    avatarURL: "/assets/users/n0ahvibes.png",
    createdAt: new Date("April 15 2026 00:57:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 3
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "la gente que responde rápido >>>>",
    type: "image",
    mediaUrl: "",
    username: "n0ahvibes",
    firstName: "Ainh0a Vibe$$$$",
    lastName: "",
    avatarURL: "/assets/users/n0ahvibes.png",
    createdAt: new Date("April 15 2026 09:58:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 7
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "acabo de abrir tiktok ‘5 min’ y han pasado 2 horas help",
    type: "image",
    mediaUrl: "",
    username: "n0ahvibes",
    firstName: "Ainh0a Vibe$$$$",
    lastName: "",
    avatarURL: "/assets/users/n0ahvibes.png",
    createdAt: new Date("April 15 2026 15:57:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 4
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "mi personalidad ahora mismo es esta canción en bucle",
    type: "image",
    mediaUrl: "/assets/posts/spotify-linking-park.jpeg",
    username: "n0ahvibes",
    firstName: "Ainh0a Vibe$$$$",
    lastName: "",
    avatarURL: "/assets/users/n0ahvibes.png",
    createdAt: new Date("April 15 2026 19:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 6
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "no sé si necesito un abrazo o dinero (probablemente ambos)",
    type: "image",
    mediaUrl: "",
    username: "lowkeydiego",
    firstName: "it's me diego",
    lastName: "",
    avatarURL: "/assets/users/lowkeydiego.png",
    createdAt: new Date("April 15 2026 05:57:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 8
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "odio salir pero también odio quedarme en casa????",
    type: "image",
    mediaUrl: "",
    username: "lowkeydiego",
    firstName: "it's me diego",
    lastName: "",
    avatarURL: "/assets/users/lowkeydiego.png",
    createdAt: new Date("April 15 2026 20:45:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 10
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "si no hay música no funciono literalmente",
    type: "image",
    mediaUrl: "",
    username: "lowkeydiego",
    firstName: "it's me diego",
    lastName: "",
    avatarURL: "/assets/users/lowkeydiego.png",
    createdAt: new Date("April 15 2026 17:46:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 12
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "11:11 pedid un deseoo",
    type: "image",
    mediaUrl: "",
    username: "lowkeydiego",
    firstName: "it's me diego",
    lastName: "",
    avatarURL: "/assets/users/lowkeydiego.png",
    createdAt: new Date("April 15 2026 08:56:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 33
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "estudiar con una pestaña abierta y otras 15 distracciones ✨productividad✨",
    type: "image",
    mediaUrl: "",
    username: "lowkeydiego",
    firstName: "it's me diego",
    lastName: "",
    avatarURL: "/assets/users/lowkeydiego.png",
    createdAt: new Date("April 15 2026 21:34:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 13
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Después de una semana con el nuevo móvil, la batería aguanta mejor de lo que esperaba 👌",
    type: "image",
    mediaUrl: "",
    username: "TecnoLuis",
    firstName: "Luis Rodríguez",
    lastName: "",
    avatarURL: "/assets/users/TecnoLuis.png",
    createdAt: new Date("April 15 2026 06:04:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 13
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Cada vez que actualizo algo me da miedo que deje de funcionar lo que ya iba bien 😅",
    type: "image",
    mediaUrl: "",
    username: "TecnoLuis",
    firstName: "Luis Rodríguez",
    lastName: "",
    avatarURL: "/assets/users/TecnoLuis.png",
    createdAt: new Date("April 15 2026 06:57:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 14
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Consejo random: haced copia de seguridad, luego no digáis que no avisé",
    type: "image",
    mediaUrl: "",
    username: "TecnoLuis",
    firstName: "Luis Rodríguez",
    lastName: "",
    avatarURL: "/assets/users/TecnoLuis.png",
    createdAt: new Date("April 15 2026 18:06:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 17
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Probé unos auriculares baratos y oye, no todo lo caro merece la pena",
    type: "image",
    mediaUrl: "",
    username: "TecnoLuis",
    firstName: "Luis Rodríguez",
    lastName: "",
    avatarURL: "/assets/users/TecnoLuis.png",
    createdAt: new Date("April 15 2026 13:56:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 19
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Echo de menos cuando los móviles venían con cargador incluido…",
    type: "image",
    mediaUrl: "",
    username: "TecnoLuis",
    firstName: "Luis Rodríguez",
    lastName: "",
    avatarURL: "/assets/users/TecnoLuis.png",
    createdAt: new Date("April 15 2026 18:13:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 12
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Me estoy planteando cambiar de portátil, el mío ya pide jubilación…",
    type: "image",
    mediaUrl: "",
    username: "TecnoLuis",
    firstName: "Luis Rodríguez",
    lastName: "",
    avatarURL: "/assets/users/TecnoLuis.png",
    createdAt: new Date("April 15 2026 09:56:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 11
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "Estoy intentando reducir el tiempo de pantalla… no va muy bien 😅",
    type: "image",
    mediaUrl: "",
    username: "TecnoLuis",
    firstName: "Luis Rodríguez",
    lastName: "",
    avatarURL: "/assets/users/TecnoLuis.png",
    createdAt: new Date("April 15 2026 10:07:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 56
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "mi horario de sueño es una sugerencia no una realidad",
    type: "image",
    mediaUrl: "",
    username: "xoel_ferrol",
    firstName: "Xoel Iglesias",
    lastName: "",
    avatarURL: "/assets/users/xoel_ferrol.png",
    createdAt: new Date("April 14 2026 23:58:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 16
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "todo iba bien hasta que tuve que hacer cosas",
    type: "image",
    mediaUrl: "",
    username: "xoel_ferrol",
    firstName: "Xoel Iglesias",
    lastName: "",
    avatarURL: "/assets/users/xoel_ferrol.png",
    createdAt: new Date("April 15 2026 14:08:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 17
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "no entiendo cómo la gente tiene la vida organizada??? tutorial?",
    type: "image",
    mediaUrl: "",
    username: "xoel_ferrol",
    firstName: "Xoel Iglesias",
    lastName: "",
    avatarURL: "/assets/users/xoel_ferrol.png",
    createdAt: new Date("April 15 2026 16:59:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 10
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "me distraigo con facilidad pero al menos soy consistente en eso",
    type: "image",
    mediaUrl: "",
    username: "xoel_ferrol",
    firstName: "Xoel Iglesias",
    lastName: "",
    avatarURL: "/assets/users/xoel_ferrol.png",
    createdAt: new Date("April 15 2026 18:58:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 31
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "dije ‘una serie más’ y ahora es de día 👍",
    type: "image",
    mediaUrl: "",
    username: "xoel_ferrol",
    firstName: "Xoel Iglesias",
    lastName: "",
    avatarURL: "/assets/users/xoel_ferrol.png",
    createdAt: new Date("April 15 2026 04:58:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 12
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "mi cerebro: hazlo\nyo: no\nmi cerebro: ok pero ansiedad",
    type: "image",
    mediaUrl: "",
    username: "BeBeBelen",
    firstName: "Belén :)",
    lastName: "",
    avatarURL: "/assets/users/BeBeBelen.png",
    createdAt: new Date("April 15 2026 11:57:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 111
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "escuchando la misma canción 47 veces seguidas como persona normal",
    type: "image",
    mediaUrl: "",
    username: "BeBeBelen",
    firstName: "Belén :)",
    lastName: "",
    avatarURL: "/assets/users/BeBeBelen.png",
    createdAt: new Date("April 15 2026 07:59:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 88
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "me encanta cancelar planes pero luego me arrepiento de cancelarlos",
    type: "image",
    mediaUrl: "",
    username: "BeBeBelen",
    firstName: "Belén :)",
    lastName: "",
    avatarURL: "/assets/users/BeBeBelen.png",
    createdAt: new Date("April 15 2026 10:18:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 102
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "necesito dejar el móvil pero también necesito el móvil",
    type: "image",
    mediaUrl: "",
    username: "BeBeBelen",
    firstName: "Belén :)",
    lastName: "",
    avatarURL: "/assets/users/BeBeBelen.png",
    createdAt: new Date("April 15 2026 15:48:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 76
    },
    comments: []
  },
  {
    _id: uuid(),
    content: "soy productivo durante exactamente 12 minutos al día",
    type: "image",
    mediaUrl: "",
    username: "BeBeBelen",
    firstName: "Belén :)",
    lastName: "",
    avatarURL: "/assets/users/BeBeBelen.png",
    createdAt: new Date("April 15 2026 19:47:16"),
    updatedAt: formatDate(),
    likes: {
      likeCount: 11
    },
    comments: []
  }
];
