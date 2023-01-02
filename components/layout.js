import Nav from "./Nav";

export default function Layout({ children }) {
  return (
    // this is to style the nav in the className (centering and adding poppins font)
    <div className="mx-6 md:max-w-2xl md:mx-auto font-poppins">
      <Nav />
      <main>{children}</main>
    </div>
  );
}
