import { useTransportStore } from '../../stores';
import { Button } from '../ui';

export function TransportControls() {
  const isPlaying = useTransportStore((s) => s.isPlaying);
  const toggle = useTransportStore((s) => s.toggle);
  const stop = useTransportStore((s) => s.stop);

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={toggle}
        variant="primary"
        size="lg"
        className="w-24"
      >
        {isPlaying ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
        )}
        <span className="ml-2">{isPlaying ? '暫停' : '播放'}</span>
      </Button>

      <Button
        onClick={stop}
        variant="secondary"
        size="lg"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="1" />
        </svg>
        <span className="ml-2">停止</span>
      </Button>
    </div>
  );
}
