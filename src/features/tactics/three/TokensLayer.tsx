import { useTacticsStore } from '../store/useTacticsStore';
import { Token } from './Token';

export function TokensLayer() {
  const tokenOrder = useTacticsStore((s) => s.tokenOrder);
  const tokens = useTacticsStore((s) => s.tokens);

  return (
    <>
      {tokenOrder.map((id) => {
        const t = tokens[id];
        if (!t) return null;
        return <Token key={id} token={t} />;
      })}
    </>
  );
}
