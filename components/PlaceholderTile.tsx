export default function PlaceholderTile({ label }: { label: string }) {
  return (
    <div className="placeholder-tile">
      <span className="ph-mark">✦</span>
      <span className="ph-label">{label}</span>
    </div>
  );
}
