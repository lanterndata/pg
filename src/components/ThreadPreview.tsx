import classNames from 'classnames';
import Link from 'next/link';

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

const ThreadPreview = ({ list, thread, isActive }: ThreadPreviewProps) => (
  <Link href={`/${list}/${thread.id}`}>
    <div
      className={classNames(
        'px-4 py-4 rounded border shadow-sm',
        isActive ? 'bg-teal-100' : 'bg-white hover:bg-teal-50'
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
  </Link>
);

export default ThreadPreview;
