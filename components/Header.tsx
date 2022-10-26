import Link from 'next/link';
import Navigation from "./Navigation";

const Header = (): JSX.Element => {
  
  return (
    <div>
      <h1 className="my-0 p-3 mt-2 m-3 text-3xl">
        <Link href="/">
          <a className="text-dark">PSP34 Site Sample</a>
        </Link>
      </h1>
      <Navigation />
    </div>
  );
};

export default Header;