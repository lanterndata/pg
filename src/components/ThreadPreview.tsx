import classNames from 'classnames';

function formatDateAsYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

interface ThreadPreviewProps {
  list?: string;
  thread: {
    id: string;
    fromName: string;
    fromAddress: string;
    subject: string | null;
    ts: Date;
    count: number;
    score?: number;
    preview?: string;
  };
  onClick: () => void;
  isActive?: boolean;
}

const ThreadPreview = ({
  thread,
  list,
  onClick,
  isActive,
}: ThreadPreviewProps) => (
  <div
    id={'preview-' + thread.id}
    className={classNames(
      'px-4 py-4 rounded border shadow-sm border-slate-600 cursor-pointer',
      isActive
        ? 'bg-slate-600 text-stone-100'
        : 'bg-slate-800 text-stone-400 hover:bg-slate-700 hover:text-stone-300'
    )}
    onClick={onClick}
  >
    {thread.score && (
      <div
        className={classNames(
          'text-xs mb-1 flex justify-between',
          isActive ? 'text-white' : 'text-stone-300'
        )}
      >
        <div>#{list}</div>
        <div>Score: {(thread.score || 1).toPrecision(3)}</div>
      </div>
    )}
    <div className='flex mb-1 text-sm'>
      <p>{thread.fromName || thread.fromAddress}</p>
      {thread.count > 1 && (
        <p className='ml-2 text-stone-400'>{thread.count}</p>
      )}
      <p className='ml-auto'>{formatDateAsYYYYMMDD(thread.ts)}</p>
    </div>
    <p className='font-medium'>{thread.subject}</p>
    {thread.preview && (
      <p
        className={classNames(
          'text-sm mt-2',
          isActive ? 'text-stone-200' : 'text-stone-500'
        )}
      >
        {thread.preview}
      </p>
    )}
  </div>
);

export default ThreadPreview;
