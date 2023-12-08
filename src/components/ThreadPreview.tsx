import classNames from 'classnames';

function formatDateAsYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1);
  const day = String(date.getDate());
  return `${year}/${month}/${day}`;
}

interface ThreadPreviewProps {
  thread: { id: string; from: string; subject: string; ts: Date };
  isActive?: boolean;
}

const ThreadPreview = ({ thread, isActive }: ThreadPreviewProps) => (
  <div
    className={classNames(
      'px-4 py-4 rounded border shadow-sm',
      isActive ? 'bg-teal-100' : 'bg-white hover:bg-teal-50'
    )}
  >
    <div className='flex justify-between mb-1 text-sm'>
      <p>{thread.from}</p>
      <p>{formatDateAsYYYYMMDD(thread.ts)}</p>
    </div>
    <p className='font-medium'>{thread.subject}</p>
  </div>
);

export default ThreadPreview;
