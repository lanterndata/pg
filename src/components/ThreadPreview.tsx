import { fontAtom } from '@/utils/atoms';
import { Thread } from '@/utils/types';
import classNames from 'classnames';
import DOMPurify from 'isomorphic-dompurify';
import { useAtom } from 'jotai';

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
}: ThreadPreviewProps) => {
  const [font] = useAtom(fontAtom);
  return (
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
            'text-xs',
            isActive ? 'text-white' : 'text-stone-300',
            font === 'ibm-plex-mono' ? 'mb-1.5' : 'mb-1'
          )}
        >
          {list ? '#' + list : ''}
        </div>
      )}
      <div className='flex text-xs mb-1.5'>
        <p>{thread.fromName || thread.fromAddress}</p>
        {thread.count > 1 && (
          <p className='ml-2 text-stone-400'>{thread.count}</p>
        )}
        <p className='ml-auto'>{formatDateAsYYYYMMDD(thread.ts)}</p>
      </div>
      <p
        className={classNames(
          'text-sm',
          isActive
            ? 'text-white font-medium'
            : 'hover:text-stone-200 text-stone-300'
        )}
      >
        {thread.subject}
      </p>
      {thread.preview && (
        <p
          className={classNames(
            'text-xs mt-2',
            isActive ? 'text-stone-200' : 'text-stone-500'
          )}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(thread.preview),
          }}
        />
      )}
    </div>
  );
};

export default ThreadPreview;
