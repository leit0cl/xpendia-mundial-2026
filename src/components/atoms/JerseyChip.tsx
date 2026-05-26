type Props = { home: string; away: string };

export function JerseyChip({ home, away }: Props) {
  return (
    <div className="kit-swatch" aria-label="Colores de camiseta">
      <span style={{ background: home }} />
      <span style={{ background: away }} />
    </div>
  );
}
