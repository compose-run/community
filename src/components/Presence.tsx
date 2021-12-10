import { usePresence } from "../state/presence";

export default function Presence() {
  const numberOnline = usePresence();
  return <div>{numberOnline} users online.</div>;
}
