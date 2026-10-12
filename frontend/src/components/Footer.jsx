import { Github, Instagram, Linkedin, Send } from "lucide-react";

const socialLinks = [
  { label: "Telegram", href: "https://t.me/temur_954", Icon: Send },
  { label: "Instagram", href: "https://www.instagram.com/playzonee.uz/", Icon: Instagram },
  { label: "GitHub", href: "https://github.com/temur-19", Icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/temur-xasanov/", Icon: Linkedin },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#020617]">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-black text-white">PlayZone.uz</p>
          <p className="mt-1">Yaqiningizdagi o‘yin va sport joylarini xaritada toping.</p>
        </div>
        <nav aria-label="Ijtimoiy tarmoqlar" className="flex flex-wrap items-center gap-2">
          {socialLinks.map(({ label, href, Icon }) => (
            <a
              aria-label={label}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 font-semibold text-slate-300 transition hover:border-yellow-300/40 hover:text-yellow-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-300"
              href={href}
              key={label}
              rel="noreferrer"
              target="_blank"
            >
              <Icon aria-hidden="true" size={16} />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
