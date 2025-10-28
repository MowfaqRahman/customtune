import { SearchIcon, ShoppingCartIcon, ChevronDownIcon, MenuIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { UserProfileDropdown } from "./UserProfileDropdown";
import Image from "next/image";

const navigationItems = [
  { label: "Shop", hasDropdown: true, dropdownItems: [
    { label: "All Products", href: "/products" },
    { label: "Category 1", href: "/products?category=1" },
    { label: "Category 2", href: "/products?category=2" },
  ] },
  { label: "On Sale", hasDropdown: false, href: "/sale" },
  { label: "New Arrivals", hasDropdown: false, href: "/new-arrivals" },
  { label: "Brands", hasDropdown: false, href: "/brands" },
];

export const NavigationBar = () => {
  const { getTotalItems } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for mobile menu

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`);
      setIsMobileMenuOpen(false); // Close mobile menu after search
    }
  };

  return (
    <nav className="flex items-center justify-between px-4 py-4 md:px-[100px] md:py-8 relative z-50">
      {/* Logo and Main Nav */}
      <div className="flex items-center gap-4 md:gap-12 w-full md:w-auto justify-between md:justify-start">
        <Link href="/">
          <Image
            src="/assets/hardtunelogo.png"
            alt="HARDTUNE"
            className="h-[80px] md:h-[110px] w-auto object-contain"
            width={110} 
            height={110} 
          />
      </Link>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/cart" className="relative">
            <ShoppingCartIcon className="w-6 h-6 cursor-pointer" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {getTotalItems()}
              </span>
            )}
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-black focus:outline-none">
            {isMobileMenuOpen ? <XIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
          </button>
        </div>

        {/* Desktop Navigation Items */}
        <div className="hidden md:flex items-center gap-6">
          {navigationItems.map((item, index) => (
            <div key={index} className="relative flex items-center gap-1">
              <span
                className="[font-family:'Satoshi-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal] cursor-pointer"
                onClick={() => item.hasDropdown && setIsShopDropdownOpen(!isShopDropdownOpen)}
              >
                {item.label}
              </span>
              {item.hasDropdown && (
                <ChevronDownIcon
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                />
              )}
              {item.hasDropdown && isShopDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10">
                  {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                    <Link key={dropdownIndex} href={dropdownItem.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {dropdownItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Search, Cart, Profile */}
      <div className="hidden md:flex items-center gap-4">
        <form onSubmit={handleSearch} className="flex items-center gap-2.5 px-4 py-3 bg-[#efefef] rounded-[62px] w-[450px]">
          <SearchIcon className="w-6 h-6 text-[#00000066]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="[font-family:'Satoshi-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal] flex-1 bg-transparent outline-none"
          />
          <button type="submit" className="[font-family:'Inder',Helvetica] font-normal text-[#00000066] text-base tracking-[0] leading-[normal]">
            All ▾
          </button>
        </form>

        <Link href="/cart" className="relative">
          <ShoppingCartIcon className="w-6 h-6 cursor-pointer" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {getTotalItems()}
            </span>
          )}
        </Link>
        <UserProfileDropdown />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-white flex flex-col pt-16 pb-4 px-4 overflow-y-auto z-40">
          <form onSubmit={handleSearch} className="flex items-center gap-2.5 px-4 py-3 bg-[#efefef] rounded-[62px] w-full mb-4">
            <SearchIcon className="w-6 h-6 text-[#00000066]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="[font-family:'Satoshi-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal] flex-1 bg-transparent outline-none"
            />
            <button type="submit" className="[font-family:'Inder',Helvetica] font-normal text-[#00000066] text-base tracking-[0] leading-[normal]">
              All ▾
            </button>
          </form>
          <nav className="flex flex-col gap-2 mt-4">
            {navigationItems.map((item, index) => (
              <React.Fragment key={index}>
                <span
                  className="[font-family:'Satoshi-Regular',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal] cursor-pointer py-2"
                  onClick={() => item.hasDropdown ? setIsShopDropdownOpen(!isShopDropdownOpen) : (router.push(item.href || '/'), setIsMobileMenuOpen(false))}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDownIcon className={`w-4 h-4 inline-block ml-2 transition-transform ${isShopDropdownOpen ? 'rotate-180' : ''}`} />
                  )}
                </span>
                {item.hasDropdown && isShopDropdownOpen && (
                  <div className="ml-4 flex flex-col gap-1">
                    {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                      <Link key={dropdownIndex} href={dropdownItem.href} className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
                        {dropdownItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
            <Link href="/profile" className="[font-family:'Satoshi-Regular',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal] cursor-pointer py-2" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
            <button onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }} className="[font-family:'Satoshi-Regular',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal] cursor-pointer text-left py-2">Sign Out</button>
          </nav>
        </div>
      )}
    </nav>
  );
};
