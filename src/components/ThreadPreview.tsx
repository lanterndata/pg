import classNames from 'classnames';

function formatDateAsYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1);
  const day = String(date.getDate());
  return `${year}/${month}/${day}`;
}

interface ThreadPreviewProps {
  list: string;
  thread: {
    id: string;
    from: string;
    subject: string;
    ts: Date;
    count: number;
  };
  isActive?: boolean;
}

const ThreadPreview = ({ thread, isActive }: ThreadPreviewProps) => (
  <div
    id={'preview-' + thread.id}
    className={classNames(
      'px-4 py-4 rounded border shadow-sm',
      isActive ? 'bg-slate-200' : 'bg-white hover:bg-slate-50'
    )}
  >
    <div className='flex mb-1 text-sm'>
      <p>{thread.from}</p>
      {thread.count > 1 && (
        <p className='ml-2 text-stone-400'>{thread.count}</p>
      )}
      <p className='ml-auto'>{formatDateAsYYYYMMDD(thread.ts)}</p>
    </div>
    <p className='font-medium'>{thread.subject}</p>
  </div>
);

export default ThreadPreview;
