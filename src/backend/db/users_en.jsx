import { v4 as uuid } from "uuid";
import { formatDate } from "../utils/authUtils.jsx";

/**
 *  Users Database
 */

export const usersEN = [
  {
    _id: uuid(),
    firstName: "FireTruthNow",
    lastName: "",
    bio: "Breaking news | fires | freedom | Agenda2030 | truth",
    username: "FireTruthNow",
    password: "ECHO",
    createdAt: new Date("December 01 2024 00:00:00"),
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
      recentAccount: false,
      temporalActivity: {
        value: true,
        mandatory: true
      },
      targetAudience: false,
      emotions: false
    }
  },
  {
    _id: uuid(),
    firstName: "WakeUpReports",
    lastName: "",
    bio: "What nobody dares to say",
    username: "WakeUpReports",
    password: "ECHO",
    createdAt: new Date("March 11 2026 00:00:00"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/LaVerdadSobreLasNoticias.png",
    verified: false,
    stats: {
      followersCount: 33,
      followingCount: 1200,
      postsCount: 3
    },
    puzzle: {
      isBot: true,
      abnormalRatio: true,
      recentAccount: {
        value: true,
        mandatory: true
      },
      temporalActivity: false,
      targetAudience: false,
      emotions: true
    }
  },
  {
    _id: uuid(),
    firstName: "Expat from US",
    lastName: "",
    bio: "Discovering Europe at my own pace",
    username: "TheExpat",
    password: "ECHO",
    createdAt: new Date("February 01 2026 00:00:00"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/TheExpat.png",
    verified: false,
    stats: {
      followersCount: 44,
      followingCount: 44,
      postsCount: 13
    },
    puzzle: {
      isBot: true,
      abnormalRatio: false,
      recentAccount: true,
      temporalActivity: false,
      targetAudience: false,
      emotions: {
        value: true,
        mandatory: true
      }
    }
  },
  {
    _id: uuid(),
    firstName: "Europe Truth Network",
    lastName: "",
    bio: "uncensored EU updates 🇪🇺\nwhat mainstream media won’t show • connect the dots",
    username: "EU_TruthSignal",
    password: "ECHO",
    createdAt: new Date("October 01 2022 00:00:00"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/EU_TruthSignal.png",
    verified: false,
    stats: {
      followersCount: "12.8K",
      followingCount: 41,
      postsCount: "500+"
    },
    puzzle: {
      isBot: true,
      abnormalRatio: true,
      recentAccount: false,
      temporalActivity: false,
      targetAudience: {
        value: true,
        mandatory: true
      },
      emotions: true
    }
  },
  {
    _id: uuid(),
    firstName: "Anna Vibe$$$$",
    lastName: "",
    bio: "too online for my own good 🫠 | coffee + music + crying over shows",
    username: "annahvibes",
    password: "ECHO",
    createdAt: new Date("May 01 2023 00:00:00"),
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
    firstName: "Aleksander LOL",
    lastName: "",
    bio: "Amateur runner 🏃‍♂️ | 3 marathons and counting",
    username: "AleksanderRunner92",
    password: "ECHO",
    createdAt: new Date("January 01 2015 00:00:00"),
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
    bio: "I live tired but with style 🧃 | probably ignoring responsibilities rn",
    username: "lowkeydiego",
    password: "ECHO",
    createdAt: new Date("March 01 2022 00:00:00"),
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
    firstName: "Matteo Rossi",
    lastName: "",
    bio: "roma | cucina, calcio, famiglia\nespresso solves everything ☕\nsempre avanti",
    username: "mateo.rossi",
    password: "ECHO",
    createdAt: new Date("February 01 2019 00:00:00"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/Matteo.png",
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
    firstName: "Clara Moreau",
    lastName: "",
    bio: "paris | art student\nmuseums, films & late walks\nliving slowly",
    username: "clara.lumiere",
    password: "ECHO",
    createdAt: new Date("April 01 2021 00:00:00"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/BeBeBelen.png",
    verified: false,
    stats: {
      followersCount: 77,
      followingCount: 43,
      postsCount: 60
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
    firstName: "Lena Schneider",
    lastName: "",
    bio: "berlin | design & chaos\ntechno, coffee, long nights\nless talking, more doing",
    username: "lena.berlin",
    password: "ECHO",
    createdAt: new Date("September 01 2015 00:00:00"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/sr_disco.png",
    verified: false,
    stats: {
      followersCount: 23,
      followingCount: 11,
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
    firstName: "Council of the EU",
    lastName: "",
    bio: "27 EU governments making decisions together in the European Council & Council of the EU. Learn, participate, share. Latest news \n@eucouncilpress\n #eucouncil #euco",
    username: "EUCouncil",
    password: "ECHO",
    createdAt: new Date("October 01 2010 00:00:00"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/EUCouncil.png",
    verified: true,
    stats: {
      followersCount: "774.9K",
      followingCount: 543,
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
    firstName: "EU Climate Action",
    lastName: "",
    bio: "We are the  @EU_Commission's Directorate-General for Climate Action (DG CLIMA).",
    username: "EUClimateAction",
    password: "ECHO",
    createdAt: new Date("October 01 2012 00:00:00"),
    updatedAt: formatDate(),
    avatarURL: "/assets/users/EUClimateAction.jpg",
    verified: true,
    stats: {
      followersCount: "138.1K",
      followingCount: "29.6K",
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
  }
];
