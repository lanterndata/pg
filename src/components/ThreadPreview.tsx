import classNames from 'classnames';

interface ThreadPreviewProps {
  isActive?: boolean;
}

const ThreadPreview = ({ isActive }: ThreadPreviewProps) => (
  <div
    className={classNames(
      'px-4 py-4 rounded border shadow-sm',
      isActive ? 'bg-teal-100' : 'bg-white hover:bg-teal-50'
    )}
  >
    <div className='flex justify-between mb-1 text-sm'>
      <p>Di Qi</p>
      <p>2022/08/31</p>
    </div>
    <p className='font-medium'>
      Get the statistics based on the application name and IP address
    </p>
  </div>
);

export default ThreadPreview;
