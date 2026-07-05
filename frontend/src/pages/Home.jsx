import { Gamepad2, MapPinned, Monitor, Navigation, Search, Trophy } from "lucide-react";
import Hero from "../components/Hero.jsx";

const categories = [
  ["PlayStation", "Konsol klublarini markerlar orqali ko‘ring", Gamepad2],
  ["Mini stadion", "Futbol maydonlarini yaqinlik bo‘yicha toping", Trophy],
  ["Billiard", "Dam olish joylarini kategoriyadan tanlang", MapPinned],
  ["PC Club", "Kompyuter klublarini xaritada qidiring", Monitor],
];

export default function Home() {
  return (
    <div>
      <Hero />
      <section id="how" className="py-14">
        <div className="mb-6"><span className="yellow-pill">Qanday ishlaydi</span><h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">Uch qadamda kerakli joyni toping</h2></div>
        <div className="grid gap-4 md:grid-cols-3">
          {[["Kirish", "Accountga kiring yoki ro‘yxatdan o‘ting.", Gamepad2], ["Joylashuv", "Brauzer GPS ruxsatini so‘raydi.", Navigation], ["Qidirish", "Marker, filter va qidiruv orqali joy tanlang.", Search]].map(([title, text, Icon]) => <article className="glass rounded-3xl p-6" key={title}><Icon className="text-yellow-300" size={28} /><h3 className="mt-5 text-xl font-black text-white">{title}</h3><p className="mt-2 leading-7 text-slate-400">{text}</p></article>)}
        </div>
      </section>
      <section id="categories" className="py-14">
        <div className="mb-6"><span className="yellow-pill">Kategoriyalar</span><h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">O‘yin va sport joylari</h2></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{categories.map(([title, text, Icon]) => <article className="group glass rounded-3xl p-6 transition hover:-translate-y-1 hover:border-yellow-300/50" key={title}><Icon className="text-yellow-300" size={30} /><h3 className="mt-5 text-xl font-black text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></article>)}</div>
      </section>
      <section id="about" className="py-14"><div className="glass rounded-[2rem] p-8 sm:p-10"><span className="yellow-pill">Biz haqimizda</span><h2 className="mt-5 max-w-3xl text-3xl font-black text-white sm:text-4xl">PlayZone.uz shahar ichidagi gaming va sport joylarini bitta xaritada jamlaydi.</h2><p className="mt-4 max-w-3xl leading-8 text-slate-400">Platforma foydalanuvchiga yaqin lokatsiyalarni ko‘rsatadi, kategoriyalar bo‘yicha filterlaydi va Yandex Maps orqali yo‘nalish olishni osonlashtiradi.</p></div></section>
    </div>
  );
}
