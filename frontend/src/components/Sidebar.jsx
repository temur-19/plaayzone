import EmptyState from "./EmptyState.jsx";
import LocationCard from "./LocationCard.jsx";

export default function Sidebar({ locations, selectedId, onSelect, distances }) {
  return (
    <aside className="map-sidebar flex max-h-[calc(100dvh-14rem)] flex-col gap-3 overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#020617]/90 p-2.5 shadow-[0_24px_80px_rgba(0,0,0,0.50)] backdrop-blur-xl sm:max-h-[60vh] sm:rounded-[2rem] sm:p-3 lg:max-h-[calc(100dvh-9rem)] lg:w-[390px]">
      <div className="map-sidebar__heading px-2 py-1"><h2 className="text-xl font-black text-white">Lokatsiyalar</h2><p className="mt-1 text-sm text-slate-400">Marker yoki cardni tanlang.</p></div>
      {locations.length ? locations.map((location) => <LocationCard distance={distances[location.id]} key={location.id} location={location} onClick={onSelect} selected={selectedId === location.id} />) : <EmptyState />}
    </aside>
  );
}
