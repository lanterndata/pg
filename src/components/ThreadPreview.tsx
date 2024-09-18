import { Thread } from '@/utils/types';
import classNames from 'classnames';
import DOMPurify from 'isomorphic-dompurify';

function formatDateAsYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

interface ThreadPreviewProps {
  list?: string;
  thread: Thread;
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
      'px-4 py-3 rounded border shadow-sm border-slate-600 cursor-pointer',
      isActive
        ? 'bg-slate-600 text-stone-100'
        : 'bg-slate-800 text-stone-400 hover:bg-slate-700 hover:text-stone-300'
    )}
    onClick={onClick}
  >
    {list && (
      <div
        className={classNames(
          'text-xs mb-1',
          isActive ? 'text-white' : 'text-stone-300'
        )}
      >
        {list ? '#' + list : ''}
      </div>
    )}
    <div className='flex mb-1 text-xs'>
      <p>{thread.fromName || thread.fromAddress}</p>
      {thread.count > 1 && (
        <p className='ml-2 text-stone-400'>{thread.count}</p>
      )}
      <p className='ml-auto'>{formatDateAsYYYYMMDD(thread.ts)}</p>
    </div>
    <p className='font-medium text-sm'>{thread.subject}</p>
    {thread.preview && (
      <p
        className={classNames(
          'text-xs mt-2',
          isActive ? 'text-stone-200' : 'text-stone-500'
        )}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(thread.preview) }}
      />
    )}
  </div>
);

export default ThreadPreview;
