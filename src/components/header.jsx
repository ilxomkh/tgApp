import PRO from "../assets/Pro.svg";
const Header = () => {
  return (
    <div className="h-36 bg-gradient-to-b from-[#6A4CFF] to-[#5936F2] text-white shadow-md">
        <div className="h-full max-w-[480px] mx-auto flex items-end justify-center pb-3">
          <img src={PRO} alt="Pro Survey" className="h-9" />
        </div>
      </div>
  );
};

export default Header;