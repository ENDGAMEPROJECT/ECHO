import { v4 as uuid } from "uuid";
import { formatDate } from "../utils/authUtils.jsx";

/**
 *  ECHO Official Account Posts (always visible, multilingual content)
 */

export const postsECHO = [
  {
    _id: uuid(),
    content: {
      es: "🚀 En ECHO damos la bienvenida a MINT AI, nuestro nuevo chat inteligente integrado en la plataforma.\n\nCon MINT AI puedes resolver dudas, contrastar información y mejorar tus publicaciones sin salir de la red social.\n\nCreemos en una comunidad más informada, más crítica y más consciente.\n\n🌿 MINT AI ya está disponible. ¿La has probado?",
      en: "🚀 ECHO welcomes MINT AI, our new intelligent chat built directly into the platform.\n\nWith MINT AI, you can ask questions, verify information, and improve your posts without leaving the social network.\n\nWe believe in a community that is more informed, more critical, and more aware.\n\n🌿 MINT AI is now available. Have you tried it?",
      fi: "🚀 ECHO toivottaa tervetulleeksi MINT AI:n, uuden älykkään chatin, joka on rakennettu suoraan alustalle.\n\nMINT AI:n avulla voit esittää kysymyksiä, tarkistaa tietoja ja parantaa julkaisujasi poistumatta sosiaalisesta verkostosta.\n\nUskomme yhteisöön, joka on paremmin informoitu, kriittisempi ja tietoisempi.\n\n🌿 MINT AI on nyt saatavilla. Oletko jo kokeillut sitä?",
      sr: "🚀 ECHO predstavlja MINT AI, naš novi inteligentni chat integrisan direktno u platformu.\n\nUz MINT AI možete postavljati pitanja, proveravati informacije i unaprediti svoje objave bez napuštanja društvene mreže.\n\nVerujemo u zajednicu koja je informisanija, kritičnija i svesnija.\n\n🌿 MINT AI je sada dostupan. Da li ste ga već isprobali?"
    },
    type: "image",
    mediaUrl: "/assets/posts/MINT.png",
    username: "ECHO",
    firstName: {
      en: "ECHO Official Account",
      es: "ECHO Oficial",
      fi: "ECHO Oy",
      sr: "ECHO Official"
    },
    lastName: "",
    avatarURL: "/assets/echo-logo-bg.png",
    createdAt: new Date("March 12 2026 10:45:00"),
    updatedAt: formatDate(),
    likes: {
      likeCount: "751.4k"
    }
  }
];
