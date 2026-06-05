import Link from 'next/link';
import TwitterIcon from 'src/icons/TwitterIcon';

const Footer = () => {
  return (
    <footer className="flex text-center justify-center text-xs text-white flex-row gap-x-5 mb-4">
      <Link href="https://x.com/merhelpdesk?s=11" target="_blank" className="items-center justify-center  w-5 h-5">
        <TwitterIcon width={20} height={20} />
      </Link>
    </footer>
  );
};

export default Footer;
